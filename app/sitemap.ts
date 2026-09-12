import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/menu', '/wybierz-menu', '/kontakt', '/regulamin', '/polityka-prywatnosci'];
  return paths.map((path) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' || path === '/menu' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/menu' || path === '/wybierz-menu' ? 0.9 : 0.6,
  }));
}
