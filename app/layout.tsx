import type { Metadata } from 'next';
import './globals.scss';
import { contact, summary } from '../src/data/resume';

export const metadata: Metadata = {
  metadataBase: new URL(contact.site),
  title: {
    default: `${contact.name} - ${contact.title}`,
    template: `%s - ${contact.name}`,
  },
  description: summary,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${contact.name} - ${contact.title}`,
    description: summary,
    url: contact.site,
    siteName: `${contact.name}`,
    type: 'profile',
    images: ['/images/background.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${contact.name} - ${contact.title}`,
    description: summary,
    images: ['/images/background.jpeg'],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: contact.name,
  jobTitle: contact.title,
  url: contact.site,
  email: `mailto:${contact.email}`,
  sameAs: [contact.linkedin, contact.github],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Melbourne',
    addressRegion: 'VIC',
    addressCountry: 'AU',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'RMIT University',
  },
  knowsAbout: ['.NET', 'C#', 'React', 'TypeScript', 'Azure', 'AWS', 'Observability', 'Incident response'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <noscript>
          <h1>{contact.name} - {contact.title}</h1>
          <p>{summary}</p>
          <p>
            <a href={`mailto:${contact.email}`}>{contact.email}</a> ·{' '}
            <a href={contact.linkedin}>LinkedIn</a> ·{' '}
            <a href={contact.github}>GitHub</a> ·{' '}
            <a href="/resume">Full resume</a>
          </p>
        </noscript>
        {children}
      </body>
    </html>
  );
}