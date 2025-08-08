import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'PWA App',
  description: 'A simple PWA with Next.js',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PWA App',
  },
  icons: {
    apple: '/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/globals.css" />
      </head>
      <body>
        <Providers>
          <nav
            style={{
              padding: '1rem',
              backgroundColor: '#f0f0f0',
              borderBottom: '1px solid #ccc',
            }}
          >
            <Link
              href="/"
              style={{
                marginRight: '1rem',
                textDecoration: 'none',
                color: '#333',
              }}
            >
              Home
            </Link>
            <Link
              href="/todos"
              style={{
                marginRight: '1rem',
                textDecoration: 'none',
                color: '#333',
              }}
            >
              Todos
            </Link>
            <Link
              href="/bills"
              style={{ textDecoration: 'none', color: '#333' }}
            >
              Bills
            </Link>
          </nav>
          <main style={{ padding: '2rem' }}>{children}</main>
        </Providers>
        <script src="/sw-register.js" defer></script>
      </body>
    </html>
  );
}
