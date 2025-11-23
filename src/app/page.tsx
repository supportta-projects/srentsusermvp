import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, getCanonicalUrl, generateKeywords } from '@/lib/seo';
import { StructuredData, generateBreadcrumbStructuredData } from '@/components/StructuredData';
import HomeClient from './HomeClient';

// Generic categories for keyword generation
const CATEGORIES = [
  { id: 'Electronics', name: 'Electronics', icon: '📱' },
  { id: 'Cameras', name: 'Cameras', icon: '📷' },
  { id: 'Lenses', name: 'Lenses', icon: '🔍' },
  { id: 'Lighting', name: 'Lighting', icon: '💡' },
  { id: 'Accessories', name: 'Accessories', icon: '🎬' },
  { id: 'Power Tools', name: 'Power Tools', icon: '🔧' },
  { id: 'Jewellery', name: 'Jewellery', icon: '💎' },
  { id: 'Dresses', name: 'Dresses', icon: '👗' },
  { id: 'Vehicles', name: 'Vehicles', icon: '🚗' },
  { id: 'Furniture', name: 'Furniture', icon: '🪑' },
  { id: 'Equipment', name: 'Equipment', icon: '⚙️' },
];

// Generate metadata for homepage
export function generateMetadata(): Metadata {
  const title = 'Rent Anything, Anywhere | rentorent - Premium Rental Marketplace';
  const description = 'Rent anything, anywhere. Discover rental shops near you. From cameras to dresses, power tools to jewellery. Find the perfect rental equipment for your needs.';
  const keywords = generateKeywords(
    'rental marketplace',
    'equipment rental',
    'camera rental',
    'dress rental',
    'tool rental',
    ...CATEGORIES.map(c => c.name)
  );

  return generateSEOMetadata({
    title,
    description,
    keywords,
    canonicalUrl: getCanonicalUrl('/'),
    openGraph: {
      type: 'website',
      siteName: 'rentorent',
      title,
      description,
      url: getCanonicalUrl('/'),
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rentorent.net'}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://rentorent.net'}/og-image.jpg`],
    },
  });
}

export default function Home() {
  const breadcrumbs = generateBreadcrumbStructuredData([
    { name: 'Home', url: getCanonicalUrl('/') },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <HomeClient />
    </>
  );
}
