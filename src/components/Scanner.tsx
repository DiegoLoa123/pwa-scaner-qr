import { useEffect, useState } from 'react';
import { useZxing } from 'react-zxing';
import { TriangleAlert, Copy } from "lucide-react";

import { detectContentType, type ContentType } from '../utils/contentType';
import { copyToClipboard } from '../utils/utils';

import { ScanPreview } from './ScanPreview';
import { ContentTypeSelector } from "../components/ContentTypeSelector";

type ScanResult = {
  raw: string;
  type: ContentType;
  scannedAt: string; // ISO
};

export function Scanner() {
  const [current, setCurrent] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [paused, setPaused] = useState(false);
  const [infoAlerta, setInfoAlerta] = useState<string | null>(null);
  const [selectType, setSelectType] = useState<ContentType>('text');

  const { ref, torch } = useZxing({
    paused,
    timeBetweenDecodingAttempts: 400,
    constraints: {
      video: { 
        facingMode: 'environment',
        advanced: [{ torch: true } as any]
      },
      audio: false,
    },
    onDecodeResult(result) {
      const raw = result.getText();
      const type = detectContentType(raw, selectType);

      if (type !== selectType) {
        setInfoAlerta("Se detectó un valor diferente especificado")
        resume(); // no detengas
        return;
      }

      setInfoAlerta(null)
      const scan: ScanResult = {
        raw,
        type,
        scannedAt: new Date().toISOString(),
      };

      setCurrent(scan);
      setHistory((prev) => {
        const next = [scan, ...prev];
        return next.slice(0, 20); // máx 20
      });

      // Pausar el escaneo para que no dispare continuamente
      setPaused(true);
    },
    onError(error) {
      // Errores de lectura/decodificación (ruido normal al no encontrar código)
      console.debug(error);
    },
  });
  
  const resultadoCopyToClipboard = async (texto:string) => await copyToClipboard(texto);

  // Cargar historial desde localStorage (offline)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('scan-history');
      if (stored) {
        setHistory(JSON.parse(stored) as ScanResult[]);
      }
    } catch {
      // ignore
    }
  }, []);

  // Guardar historial
  useEffect(() => {
    try {
      window.localStorage.setItem('scan-history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const resume = () => setPaused(false);
  const clearHistory = () => {
    setHistory([]);
    window.localStorage.removeItem('scan-history');
  };

  const handlePausar = () => {
    setPaused(true)
    setInfoAlerta(null)
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 sm:py-3 sm:px-3 py-3 px-1">
      <div className="sm:rounded-2xl rounded-md border border-slate-600 bg-slate-900/60 sm:p-3 py-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Cámara
          </p>
          <ContentTypeSelector value={selectType} onChange={setSelectType} />
        </div>

        <div className="relative aspect-video overflow-hidden sm:rounded-2xl rounded-md border border-slate-700 bg-black">
          <video
            ref={ref}
            className="h-full w-full object-cover"
            muted
            playsInline
          />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 bottom-0 border-l border-red-500/50 left-1/3"></div>
            <div className="absolute top-0 bottom-0 border-l border-red-500/50 left-2/3"></div>
            <div className="absolute left-0 right-0 border-t border-red-500/50 top-1/3"></div>
            <div className="absolute left-0 right-0 border-t border-red-500/50 top-2/3"></div>
          </div>
        </div>

        <p className="mt-2 text-[10px] text-slate-500">Consejo: acerca el código al centro del recuadro y mantén el móvil firme.</p>
        {infoAlerta && <p className="flex gap-1 mx-auto w-fit mt-1 px-2 py-1 text-xs text-amber-500 rounded-full ring-1 ring-amber-400">
          <TriangleAlert size={16} />
          {infoAlerta}
          <TriangleAlert size={16} />
        </p>}

        <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
          {!paused && (
            <button
              type="button"
              onClick={handlePausar}
              className="outline-0 p-2 text-base font-medium rounded-lg cursor-pointer border border-red-600 text-red-100 hover:bg-red-800 focus:ring-2 focus:ring-red-600"
            >
              Pausar
            </button>
          )}
          
          <button
            type="button"
            onClick={resume}
            className={`outline-0 px-5 py-2 text-base font-medium rounded-lg cursor-pointer transition duration-200 hover:ring-1 focus:ring-2 ${paused ? "bg-gray-700 hover:bg-gray-800 hover:ring-gray-500 focus:ring-gray-500" : "bg-blue-800 hover:bg-blue-900 hover:ring-violet-500 focus:ring-violet-500"}`}
          >
            {paused ? 
              'Reanudar escaneo' : 
              <div className='flex items-center gap-1.5'>
                <p>Escaneando...</p>
                <span className="block animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
              </div>
            }
          </button>

          {torch?.isAvailable && (
            <button
              type="button"
              onClick={() => (torch.isOn ? torch.off() : torch.on())}
              className="rounded-full border border-slate-600 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-slate-800"
            >
              {torch.isOn ? 'Apagar linterna' : 'Encender linterna'}
            </button>
          )}
        </div>
      </div>

      <ScanPreview value={current?.raw ?? null} clearValue={() => setCurrent(null)}/>

      {history.length > 0 && (
        <div className="mt-4 rounded-2xl border border-slate-600 bg-slate-900/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Historial (offline)
            </p>
            <button
              type="button"
              onClick={clearHistory}
              className="text-[10px] outline-0 px-1 rounded-sm font-semibold text-red-400 hover:bg-red-400 hover:text-black focus:bg-red-400 focus:text-black"
            >
              Limpiar
            </button>
          </div>

          <ul className="space-y-2 max-h-48 overflow-auto text-xs">
            {history.map((item, idx) => (
              <li
                key={item.scannedAt + idx}
                className="rounded-xl border border-slate-700/70 bg-slate-900/80 p-2"
              >
                <p className="font-mono text-[11px] text-slate-50 wrap-break-word">
                  {item.raw}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-400">
                    Tipo: <span className="font-semibold text-emerald-400">{item.type}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => resultadoCopyToClipboard(item.raw)}
                    className="text-xs outline-0 p-1 rounded-sm font-semibold text-yellow-300 bg-sky-700 hover:bg-yellow-300 hover:text-sky-700 focus:ring-2 focus:ring-yellow-300"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
