import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Application foundation',
  description: 'Minimum Next.js foundation for the approved rebuild.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
