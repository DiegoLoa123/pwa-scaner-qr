import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import {
  Globe, Mail, Phone, Wifi, Barcode, FileText,
  MessageCircle, Youtube
} from 'lucide-react';

import type { ContentType } from '../utils/contentType';

type Props = {
  value: ContentType;
  onChange: (c: ContentType) => void;
};

const OPTIONS: { type: ContentType; label: string; icon: ReactNode }[] = [
  { type: 'url', label: 'URL', icon: <Globe size={16} /> },
  { type: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={16} /> },
  { type: 'youtube', label: 'YouTube', icon: <Youtube size={16} /> },
  { type: 'email', label: 'Correo', icon: <Mail size={16} /> },
  { type: 'phone', label: 'Teléfono', icon: <Phone size={16} /> },
  { type: 'wifi', label: 'WiFi', icon: <Wifi size={16} /> },
  { type: 'barcode', label: 'Barras', icon: <Barcode size={16} /> },
  { type: 'text', label: 'Texto', icon: <FileText size={16} /> },
];

export function ContentTypeSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = OPTIONS.find(o => o.type === value)!;

  // Cierra cuando se hace clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full sm:w-60 select-none">
      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
      >
        <div className="flex items-center gap-2">
          {current.icon}
          <span>{current.label}</span>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl backdrop-blur-xl">
          {OPTIONS.map(opt => {
            const active = value === opt.type;

            return (
              <button
                key={opt.type}
                onClick={() => {
                  onChange(opt.type);
                  setOpen(false);
                }}
                className={[
                  'flex w-full items-center justify-between gap-2 px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-slate-300 hover:bg-slate-800'
                ].join(' ')}
              >
                <div className="flex items-center gap-2">
                  {opt.icon}
                  {opt.label}
                </div>

                {active && (
                  <Check
                    size={16}
                    className="rounded-full bg-emerald-500 text-slate-900 p-px"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
