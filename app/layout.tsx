import type { Metadata } from 'next';
import './globals.css';

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
      <body className="m-0 p-0 overflow-hidden">
        {children}
      </body>
    </html>
  );
}