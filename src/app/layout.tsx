import type { Metadata } from 'next';
import { Archivo, Archivo_Black, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const sans = Archivo({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: '400', variable: '--font-mono', display: 'swap' });
const display = Archivo_Black({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: 'astraa / Interfaces in motion',
  description: 'Astraa, a fullstack developer in Vietnam focused on expressive UI and thoughtful motion. Selected work: ProZ0, MediMate AI and FinGenie.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}><body>{children}</body></html>;
}
