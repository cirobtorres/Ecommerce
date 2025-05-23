import type { Metadata } from 'next';
import { Providers } from './providers';
import Header from './components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-100 text-neutral-900">
        <Providers>
          <div className="min-h-screen flex flex-col max-w-6xl mx-auto px-6 py-4">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
