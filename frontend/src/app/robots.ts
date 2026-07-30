import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/appointments/',
        '/clients/',
        '/portal/appointments',
        '/portal/summary',
        '/settings/',
        '/notifications/',
        '/payments/',
        '/audit-logs/',
        '/automations/',
        '/analytics/',
        '/api/',
      ],
    },
    sitemap: 'https://abco.legal/sitemap.xml',
  };
}
