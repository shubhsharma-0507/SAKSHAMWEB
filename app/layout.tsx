import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'SAKSHAM — Right Hospital. Right Time. Saves Lives.',
  description:
    'SAKSHAM helps you find the right hospital during a medical emergency — based on available facilities, ICU beds, specialists, and capacity, not just distance.',
  keywords: 'emergency hospital, ICU beds, hospital finder, medical emergency, saksham',
  openGraph: {
    title: 'SAKSHAM — Right Hospital. Right Time. Saves Lives.',
    description: 'Find the right hospital based on your emergency needs, not just distance.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
