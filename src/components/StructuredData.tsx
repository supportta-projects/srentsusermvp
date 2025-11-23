import Script from 'next/script';
import type { Product, Shop } from '@/types';
import { getSiteUrl, extractBrand } from '@/lib/seo';

interface StructuredDataProps {
  data: Record<string, any>;
}

/**
 * Generic structured data component that outputs JSON-LD
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id={`structured-data-${Date.now()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Generate Product structured data (Schema.org)
 */
export function generateProductStructuredData(
  product: Product,
  shop?: Shop | null
): Record<string, any> {
  const siteUrl = getSiteUrl();
  const brand = extractBrand(product.title);
  
  const productData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || `${product.title} available for rent in ${product.city}`,
    image: product.imageUrls.length > 0 ? product.imageUrls : undefined,
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.pricePerDay,
      priceCurrency: 'INR',
      availability: product.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: product.pricePerDay,
        priceCurrency: 'INR',
        unitCode: 'DAY',
      },
    },
    url: `${siteUrl}/products/${product.id}`,
  };

  if (brand) {
    productData.brand = {
      '@type': 'Brand',
      name: brand,
    };
  }

  if (product.condition) {
    productData.itemCondition = `https://schema.org/${product.condition}Condition`;
  }

  if (shop?.rating && shop.totalRatings) {
    productData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: shop.rating,
      reviewCount: shop.totalRatings,
    };
  }

  return productData;
}

/**
 * Generate Organization structured data (Schema.org)
 */
export function generateOrganizationStructuredData(
  shop: Shop,
  productCount?: number
): Record<string, any> {
  const siteUrl = getSiteUrl();
  
  const orgData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: shop.name,
    url: `${siteUrl}/shops/${shop.id}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: shop.city,
      addressCountry: 'IN',
      ...(shop.address && { streetAddress: shop.address }),
    },
    telephone: shop.phone,
    email: shop.email,
  };

  if (shop.rating && shop.totalRatings) {
    orgData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: shop.rating,
      reviewCount: shop.totalRatings,
    };
  }

  if (productCount !== undefined) {
    orgData.numberOfEmployees = {
      '@type': 'QuantitativeValue',
      value: productCount,
    };
  }

  return orgData;
}

/**
 * Generate BreadcrumbList structured data (Schema.org)
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate WebSite structured data (Schema.org)
 */
export function generateWebSiteStructuredData(): Record<string, any> {
  const siteUrl = getSiteUrl();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'rentorent',
    url: siteUrl,
    description: 'Rent anything, anywhere. Discover rental shops near you.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}


