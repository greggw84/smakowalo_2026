import type { Metadata } from 'next';
import { buildMetadata, ROUTE_SEO } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(ROUTE_SEO.kontakt);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
