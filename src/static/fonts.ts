import { Commissioner, Gelasio, Shantell_Sans } from 'next/font/google';
const header = Commissioner({ subsets: ['latin'], variable: "--font-header" });
const main = Gelasio({ subsets: ['latin'], variable: "--font-main" });
const accent = Shantell_Sans({ subsets: ['latin'], variable: "--font-accent" });

export const FONTS = [header, main, accent].map(({ variable }) => variable).join(" ");
