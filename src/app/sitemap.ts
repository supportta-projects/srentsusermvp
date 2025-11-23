import { MetadataRoute } from 'next';
import { getProducts, getShops } from '@/lib/firestore';
import { getSiteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Homepage
  sitemapEntries.push({
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  });

  try {
    // Get all products (with a large limit for sitemap)
    // Note: In production, you may want to paginate this or use a more efficient method
    const productsResult = await getProducts({}, 'relevance', 10000);
    const products = productsResult.products;

    // Add product pages
    products.forEach((product) => {
      sitemapEntries.push({
        url: `${siteUrl}/products/${product.id}`,
        lastModified: product.updatedAt || product.createdAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    // Get all shops
    const shops = await getShops();

    // Add shop pages
    shops.forEach((shop) => {
      sitemapEntries.push({
        url: `${siteUrl}/shops/${shop.id}`,
        lastModified: shop.updatedAt || shop.createdAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the homepage if there's an error
  }

  return sitemapEntries;
}

