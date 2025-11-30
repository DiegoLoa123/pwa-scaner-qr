import { type ReactNode } from "react";
import type { ContentType } from '../utils/contentType';
import { detectContentType } from '../utils/contentType';

import { Copy } from "lucide-react";
import { copyToClipboard } from '../utils/utils';

type Props = {
  value: string | null;
  clearValue: () => void;
};

function getDescription(type: ContentType): string {
  switch (type) {
    case 'whatsapp':
      return 'Enlace de WhatsApp: abrirá un chat, grupo o número.';
    case 'youtube':
      return 'Enlace de YouTube: abrirá un video.';
    case 'url':
      return 'Enlace web normal (HTTP/HTTPS).';
    case 'email':
      return 'Dirección de correo: puedes enviar un email.';
    case 'phone':
      return 'Número de teléfono: puedes llamar o guardar el contacto.';
    case 'wifi':
      return 'Configuración de red WiFi (SSID/clave).';
    case 'text':
    default:
      return 'Texto plano (no es enlace).';
  }
}

export function ScanPreview({ value, clearValue }: Props) {
  if (!value) {
    return (
      <div className="mt-4 text-sm text-slate-400">
        Aún no se ha escaneado ningún código.
      </div>
    );
  }

  const type = detectContentType(value);
  const description = getDescription(type);
  
  const resultadoCopyToClipboard = async (texto:string) => await copyToClipboard(texto);

  let link: ReactNode | null = null;

  if (type === 'url' || type === 'whatsapp' || type === 'youtube') {
    link = (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="outline-0 px-1 rounded-sm inline-flex items-center gap-1 text-sm font-medium text-emerald-400 focus:ring-2 focus:ring-emerald-500 underline underline-offset-4 transition duration-200"
      >
        Abrir enlace
      </a>
    );
  } else if (type === 'email') {
    const href = value.toLowerCase().startsWith('mailto:')
      ? value
      : `mailto:${value}`;
    link = (
      <a
        href={href}
        className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 underline underline-offset-4"
      >
        Enviar correo
      </a>
    );
  } else if (type === 'phone') {
    const normalized = value.toLowerCase().startsWith('tel:')
      ? value
      : `tel:${value.replace(/\s+/g, '')}`;
    link = (
      <a
        href={normalized}
        className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 underline underline-offset-4"
      >
        Llamar
      </a>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-600 bg-slate-900/60 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Resultado actual
        </p>
        <button
          type="button"
          onClick={clearValue}
          className="text-[10px] outline-0 px-1 rounded-sm font-semibold text-red-400 hover:bg-red-400 hover:text-black focus:bg-red-400 focus:text-black"
        >
          Limpiar
        </button>
      </div>

      <p className="mt-2 wrap-break-word text-sm text-slate-50">{value}</p>
      
      <div className="flex items-center justify-between">
        <p className="mt-2 text-xs text-slate-400">
          Tipo detectado: <span className="font-semibold text-emerald-400">{type}</span>
        </p>
        <button
          type="button"
          onClick={() => resultadoCopyToClipboard(value)}
          className="text-xs outline-0 p-1 rounded-sm font-semibold text-yellow-300 bg-sky-700 hover:bg-yellow-300 hover:text-sky-700 focus:ring-2 focus:ring-yellow-300"
        >
          <Copy size={16} />
        </button>
      </div>

      <p className="mt-1 text-xs text-slate-400">{description}</p>

      {link && <div className="mt-3">{link}</div>}
    </div>
  );
}
