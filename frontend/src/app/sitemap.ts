import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://abco.legal';
  
  const publicRoutes = [
    '',
    '/about',
    '/services',
    '/blog',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
    '/book',
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/blog' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
