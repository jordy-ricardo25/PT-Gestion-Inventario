import './globals.css';
import type { Metadata } from 'next';
import { RQProvider } from '@lib/query-client';


export const metadata: Metadata = { title: 'Gestión de Inventario', description: 'Productos & Transacciones' };


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center">
        <RQProvider>{children}</RQProvider>
      </body>
    </html>
  );
}