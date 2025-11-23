import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentorent.net';
const SITE_NAME = 'rentorent';
const DEFAULT_DESCRIPTION = 'Rent anything, anywhere. Discover rental shops near you. From cameras to dresses, power tools to jewellery.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * Get the base site URL
 */
export function getSiteUrl(): string {
  return SITE_URL;
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}

/**
 * Sanitize text for meta tags (remove HTML, extra whitespace)
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

/**
 * Generate keywords array from text
 */
export function generateKeywords(...texts: (string | undefined | null)[]): string[] {
  const keywords = new Set<string>();
  
  texts.forEach(text => {
    if (!text) return;
    const words = text
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(word => word.length > 2)
      .slice(0, 10); // Limit to 10 words per text
    
    words.forEach(word => keywords.add(word));
  });
  
  return Array.from(keywords).slice(0, 20); // Max 20 keywords
}

/**
 * Generate page title
 */
export function generateTitle(
  pageTitle: string,
  includeSiteName: boolean = true
): string {
  if (includeSiteName) {
    return `${pageTitle} | ${SITE_NAME}`;
  }
  return pageTitle;
}

/**
 * Generate meta description
 */
export function generateDescription(
  description?: string,
  fallback: string = DEFAULT_DESCRIPTION
): string {
  if (description) {
    return truncateText(sanitizeText(description), 160);
  }
  return fallback;
}

/**
 * Generate Open Graph metadata
 */
export function generateOpenGraph({
  title,
  description,
  url,
  image,
  type = 'website',
  siteName = SITE_NAME,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  siteName?: string;
}): Metadata['openGraph'] {
  return {
    type,
    siteName,
    title,
    description,
    url,
    images: [
      {
        url: image || DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterCard({
  title,
  description,
  image,
  card = 'summary_large_image',
}: {
  title: string;
  description: string;
  image?: string;
  card?: 'summary' | 'summary_large_image';
}): Metadata['twitter'] {
  return {
    card,
    title,
    description,
    images: image ? [image] : [DEFAULT_IMAGE],
  };
}

/**
 * Generate complete metadata object
 */
export function generateMetadata({
  title,
  description,
  keywords,
  canonicalUrl,
  openGraph,
  twitter,
  noindex = false,
  nofollow = false,
}: {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  openGraph?: Metadata['openGraph'];
  twitter?: Metadata['twitter'];
  noindex?: boolean;
  nofollow?: boolean;
}): Metadata {
  const robots = [];
  if (noindex) robots.push('noindex');
  if (nofollow) robots.push('nofollow');
  if (robots.length === 0) robots.push('index', 'follow');

  return {
    title,
    description,
    keywords: keywords?.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
      },
    },
    openGraph: openGraph || generateOpenGraph({
      title,
      description,
      url: canonicalUrl || SITE_URL,
    }),
    twitter: twitter || generateTwitterCard({
      title,
      description,
    }),
  };
}

/**
 * Extract brand from product title
 */
export function extractBrand(title: string): string {
  const commonBrands = [
    'Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic', 'Olympus',
    'Leica', 'Pentax', 'Sigma', 'Tamron', 'Tokina', 'Zeiss',
    'Apple', 'Samsung', 'Google', 'Microsoft', 'Dell', 'HP',
    'Bosch', 'DeWalt', 'Makita', 'Milwaukee', 'Ryobi',
  ];
  
  for (const brand of commonBrands) {
    if (title.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  
  return '';
}

