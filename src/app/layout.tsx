import type { Metadata } from 'next';
import '@/styles/tailwind.css';
import { Footer, Nav } from '@/components';

export const metadata: Metadata = {
  title: 'Narragansett Bay Data Explorer',
  description: 'A Data Dashboard for the Rhode Island Data Discovery Center',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body /* className="bg-no-repeat bg-gradient-to-b from-cyan-950 to-white" */>
        <Nav />
        <main className="relative bg-white dark:bg-black text-black dark:text-white">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
