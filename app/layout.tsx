import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CloutNet - Instagram Network Analysis',
  description: 'Discover influential accounts by analyzing who multiple seed accounts follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
