import type { MetadataRoute } from 'next';
import { contact } from '../src/data/resume';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: `${contact.site}/`, changeFrequency: 'monthly', priority: 1 },
        { url: `${contact.site}/resume`, changeFrequency: 'monthly', priority: 0.9 },
    ];
}
