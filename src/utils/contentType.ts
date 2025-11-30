export type ContentType =
  | 'url'
  | 'whatsapp'
  | 'youtube'
  | 'email'
  | 'phone'
  | 'wifi'
  | 'barcode'
  | 'text';

export function detectContentType(raw: string, mode?: ContentType): ContentType {
  const text = raw.trim();
  const lower = text.toLowerCase();

  // Funciones de validación por tipo
  const validators: Record<ContentType, (s: string) => boolean> = {
    wifi: (s) => s.toLowerCase().startsWith('wifi:'),

    whatsapp: (s) =>
      s.startsWith('https://wa.me/') ||
      s.includes('api.whatsapp.com') ||
      s.includes('chat.whatsapp.com'),

    youtube: (s) =>
      s.includes('youtube.com/watch') || s.includes('youtu.be/'),

    email: (s) =>
      s.startsWith('correo') ||
      s.startsWith('mailto') ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s),

    barcode: (s) =>
      /^\d{8,14}$/.test(s) ||
      (/^[A-Z0-9\-]+$/i.test(s) && s.length >= 6),

    phone: (s) =>
      s.startsWith('cel') ||
      s.startsWith('tel') ||
      /^\+?[0-9 ()-]{6,}$/.test(s),

    url: (s) => /^https?:\/\/\S+$/i.test(s),

    text: () => true // fallback
  };

  // ✔ Si hay modo, solo evalúa ese tipo
  if (mode) {
    return validators[mode](lower) ? mode : 'text';
  }

  // ✔ Modo normal: detección automática
  for (const type of [
    'wifi',
    'whatsapp',
    'youtube',
    'email',
    'barcode',
    'phone',
    'url'
  ] as ContentType[]) {
    if (validators[type](lower)) return type;
  }

  return 'text';
}
