import { Scanner } from './components/Scanner';

export default function ScanerQr() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/80 px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight">
          QR & Barcode Scanner V.1.2.6
        </h1>
        <p className="text-xs text-slate-400">
          PWA offline para leer códigos y entender qué hacen sus enlaces.
        </p>
      </header>

      <section className="flex flex-1 flex-col">
        <Scanner />
      </section>

      <footer className="px-4 pb-3 pt-1 text-[10px] text-slate-500">
        Funciona offline una vez instalada como app (PWA).
      </footer>
    </main>
  );
}
