import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Connor Hutchinson - Senior Software Engineer',
  description: 'Interactive Windows XP-style resume website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}