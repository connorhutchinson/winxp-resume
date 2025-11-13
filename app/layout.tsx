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
      <body>
        {children}
      </body>
    </html>
  );
}