import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShop, getProducts } from '@/lib/firestore';
import { generateMetadata as generateSEOMetadata, getCanonicalUrl, generateKeywords, getSiteUrl } from '@/lib/seo';
import { StructuredData, generateOrganizationStructuredData, generateBreadcrumbStructuredData } from '@/components/StructuredData';
import ShopClient from './ShopClient';

interface ShopPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { id } = await params;
  const shop = await getShop(id);
  
  if (!shop) {
    return {
      title: 'Shop Not Found | rentorent',
    };
  }

  // Get shop products count for description - optimized to only fetch shop products
  const productsData = await getProducts({ shopId: id }, 'relevance', 20);
  const shopProducts = productsData.products;
  const productCount = shopProducts.length;

  const title = `${shop.name} - Rental Shop in ${shop.city} | rentorent`;
  const description = `${shop.name} is a rental shop in ${shop.city}. ${productCount > 0 ? `Browse ${productCount} products available for rent.` : 'Browse our rental products.'} ${shop.rating ? `Rated ${shop.rating.toFixed(1)}/5.` : ''} Contact us for rentals.`;
  
  const keywords = generateKeywords(
    shop.name,
    shop.city,
    'rental shop',
    'rental',
    ...shopProducts.slice(0, 5).map(p => p.category)
  );

  const canonicalUrl = getCanonicalUrl(`/shops/${shop.id}`);
  const ogImage = `${getSiteUrl()}/og-image.jpg`;

  return generateSEOMetadata({
    title,
    description,
    keywords,
    canonicalUrl,
    openGraph: {
      type: 'website',
      siteName: 'rentorent',
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: shop.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  });
}

export default async function ShopDetailPage({ params }: ShopPageProps) {
  const { id } = await params;
  const shop = await getShop(id);

  if (!shop) {
    notFound();
  }

  // Get products for this shop - optimized query
  const productsData = await getProducts({ shopId: id }, 'relevance', 50);
  const shopProducts = productsData.products;

  const orgStructuredData = generateOrganizationStructuredData(shop, shopProducts.length);
  const breadcrumbs = generateBreadcrumbStructuredData([
    { name: 'Home', url: getCanonicalUrl('/') },
    { name: 'Shops', url: getCanonicalUrl('/') },
    { name: shop.name, url: getCanonicalUrl(`/shops/${shop.id}`) },
  ]);

  return (
    <>
      <StructuredData data={orgStructuredData} />
      <StructuredData data={breadcrumbs} />
      <ShopClient shop={shop} products={shopProducts} />
    </>
  );
}
