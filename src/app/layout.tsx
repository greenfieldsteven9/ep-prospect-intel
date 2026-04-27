import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/ui/Nav';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EP Prospect Intel',
  description: 'Prospect scouting and career progression analytics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-text-primary antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-4 text-center text-text-muted text-xs">
          EP Prospect Intel · Seed data — not affiliated with Elite Prospects
        </footer>
      </body>
    </html>
  );
}
