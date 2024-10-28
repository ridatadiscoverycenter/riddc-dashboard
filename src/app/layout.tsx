import type { Metadata } from 'next';
import '@/styles/tailwind.css';
import { Nav } from '@/components';

export const metadata: Metadata = {
  title: 'Narragansett Bay Data Explorer',
  description: 'A Data Dashboard for the Rhode Island Data Discovery Center',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
