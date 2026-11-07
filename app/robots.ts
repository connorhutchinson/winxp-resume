import type { MetadataRoute } from 'next';
import { contact } from '../src/data/resume';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${contact.site}/sitemap.xml`,
    };
}
