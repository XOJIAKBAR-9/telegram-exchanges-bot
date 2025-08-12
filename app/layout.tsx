import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Exchange Rates Bot ',
  description: 'Get live exchange rates from multiple banks in Uzbekistan',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID;

  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Analytics 4 - Only load if Measurement ID is set */}
        {measurementId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${measurementId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.className} dark`}>
        <div className="min-h-screen bg-background">{children}</div>
        <script
          src="https://telegram.org/js/telegram-web-app.js"
          async
        ></script>
      </body>
    </html>
  );
}
