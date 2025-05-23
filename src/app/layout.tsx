import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/tailwind.css';
import { Footer, Nav } from '@/components';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Narragansett Bay Data Explorer',
  description: 'A Data Dashboard for the Rhode Island Data Discovery Center',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body
        className={`min-h-[100vh] flex flex-col bg-c-background-light dark:bg-c-background-dark text-black dark:text-white font-main`}
      >
        <Nav />
        <main className="flex-1 relative overflow-clip flex flex-col items-center content-center gap-4">
          <Beam via="via-teal-400 dark:via-teal-600" top="-top-[500px]" right="right-[800px]" />
          <Beam via="via-amber-400 dark:via-amber-800" top="-top-[600px]" right="right-[1000px]" />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

function Beam({ via, top, right }: { via: string; top: string; right: string }) {
  return (
    <div
      aria-hidden
      className={`w-[512px] h-[280vh] -z-10 bg-gradient-to-r from-transparent ${via} to-transparent blur-2xl opacity-20 absolute ${top} ${right} rotate-45`}
    />
  );
}
