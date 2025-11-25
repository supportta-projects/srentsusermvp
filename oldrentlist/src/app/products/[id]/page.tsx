import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getProduct, getShop } from '@/lib/firestore';
import { generateMetadata as generateSEOMetadata, getCanonicalUrl, generateKeywords, extractBrand } from '@/lib/seo';
import { StructuredData, generateProductStructuredData, generateBreadcrumbStructuredData } from '@/components/StructuredData';
import ProductClient from './ProductClient';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import Header from '@/components/Header';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Product Not Found | rentorent',
    };
  }

  const shop = await getShop(product.shopId);
  const title = `${product.title} - Rent in ${product.city} | rentorent`;
  const description = product.description || 
    `${product.title} available for rent in ${product.city}. ${product.category} rental at ₹${product.pricePerDay}/day. ${product.available ? 'Available now' : 'Check availability'}.`;
  
  const keywords = generateKeywords(
    product.title,
    product.category,
    product.city,
    ...product.tags,
    'rental',
    'rent',
    extractBrand(product.title)
  );

  const canonicalUrl = getCanonicalUrl(`/products/${product.id}`);
  const ogImage = product.imageUrls.length > 0 
    ? product.imageUrls[0] 
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rentorent.net'}/og-image.jpg`;

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
          alt: product.title,
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

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const shop = await getShop(product.shopId);

  const productStructuredData = generateProductStructuredData(product, shop);
  const breadcrumbs = generateBreadcrumbStructuredData([
    { name: 'Home', url: getCanonicalUrl('/') },
    { name: 'Products', url: getCanonicalUrl('/') },
    { name: product.title, url: getCanonicalUrl(`/products/${product.id}`) },
  ]);

  return (
    <>
      <StructuredData data={productStructuredData} />
      <StructuredData data={breadcrumbs} />
      <ProductClient product={product} shop={shop} />
    </>
  );
}
