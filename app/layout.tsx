import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Northstar Advisory',
  description: 'A practical consulting proof site built for an autonomous AI development workflow.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><Header /><main className="site-main">{children}</main><Footer /></>;
}
