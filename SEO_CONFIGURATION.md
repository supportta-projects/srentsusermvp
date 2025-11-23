# SEO Configuration for rentorent.net

## ✅ Completed Updates

All code has been updated to use **rentorent.net** as the domain and **rentorent** as the brand name.

### Files Updated:
1. ✅ `src/lib/seo.ts` - Default site URL changed to `https://rentorent.net`
2. ✅ `src/app/layout.tsx` - Brand name updated to "rentorent"
3. ✅ `src/app/page.tsx` - Domain and brand name updated
4. ✅ `src/app/products/[id]/page.tsx` - Domain and brand name updated
5. ✅ `src/app/shops/[id]/page.tsx` - Domain and brand name updated
6. ✅ `src/components/StructuredData.tsx` - Site name updated to "rentorent"
7. ✅ `src/components/Header.tsx` - Brand name updated to "rentorent"
8. ✅ `README.md` - Documentation updated with correct domain

---

## 🔧 Next Steps: Environment Variable Setup

### Local Development

1. **Create or update `.env.local` file** in project root:
   ```env
   NEXT_PUBLIC_SITE_URL=https://rentorent.net
   ```

2. **Restart your development server:**
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart
   pnpm run dev
   ```

### Production Server (VPS: 213.210.36.7)

1. **SSH into your server:**
   ```bash
   ssh root@213.210.36.7
   ```

2. **Navigate to project directory:**
   ```bash
   cd /var/www/srentsusermvp
   ```

3. **Create or edit `.env.local` file:**
   ```bash
   nano .env.local
   ```

4. **Add/update this line:**
   ```env
   NEXT_PUBLIC_SITE_URL=https://rentorent.net
   ```
   
   **Note:** If SSL is not set up yet, use `http://rentorent.net` temporarily

5. **Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

6. **Rebuild and restart:**
   ```bash
   pnpm install
   pnpm run build
   pm2 restart srents
   ```

---

## 🧪 Testing Checklist

### 1. Verify Sitemap
- **URL:** `https://rentorent.net/sitemap.xml`
- **Expected:** XML sitemap with all products and shops
- **Check:** URLs should use `https://rentorent.net`

### 2. Verify Robots.txt
- **URL:** `https://rentorent.net/robots.txt`
- **Expected:** 
  ```
  User-agent: *
  Allow: /
  Disallow: /api/
  Disallow: /admin/
  
  Sitemap: https://rentorent.net/sitemap.xml
  ```

### 3. Test Metadata with Tools

#### Google Rich Results Test
- **Tool:** https://search.google.com/test/rich-results
- **Test URL:** `https://rentorent.net/products/[any-product-id]`
- **Check for:** Product structured data, BreadcrumbList

#### Facebook Sharing Debugger
- **Tool:** https://developers.facebook.com/tools/debug/
- **Test URL:** `https://rentorent.net/products/[any-product-id]`
- **Check:** Open Graph title, description, image

#### Twitter Card Validator
- **Tool:** https://cards-dev.twitter.com/validator
- **Test URL:** `https://rentorent.net/products/[any-product-id]`
- **Check:** Card preview with correct image and title

---

## 🌐 DNS & SSL Setup (If Not Done)

### DNS Configuration
Ensure your domain DNS records point to your server:
- **A Record:** `rentorent.net` → `213.210.36.7`
- **A Record:** `www.rentorent.net` → `213.210.36.7` (optional)

### SSL Certificate Setup
```bash
# On your VPS
apt install -y certbot python3-certbot-nginx
certbot --nginx -d rentorent.net -d www.rentorent.net
```

### Nginx Configuration Update
Update `/etc/nginx/sites-available/srents`:
```nginx
server {
    listen 80;
    server_name rentorent.net www.rentorent.net;
    
    # ... rest of your config
}
```

---

## 📋 Verification Commands

### On Local Machine:
```bash
# Check environment variable (if .env.local exists)
type .env.local | findstr NEXT_PUBLIC_SITE_URL

# Start dev server
pnpm run dev

# Test URLs in browser:
# - http://localhost:3000/sitemap.xml
# - http://localhost:3000/robots.txt
```

### On Production Server:
```bash
# Check environment variable
grep NEXT_PUBLIC_SITE_URL .env.local

# Check PM2 status
pm2 status

# View logs
pm2 logs srents

# Test sitemap
curl https://rentorent.net/sitemap.xml
```

---

## ✅ Expected Results

After configuration, you should see:

1. **All metadata** uses `https://rentorent.net` as the base URL
2. **Sitemap** contains URLs like `https://rentorent.net/products/[id]`
3. **Structured data** shows "rentorent" as the site name
4. **Open Graph tags** use `https://rentorent.net` URLs
5. **Canonical URLs** point to `https://rentorent.net` pages

---

## 🐛 Troubleshooting

### Issue: Still seeing old domain in metadata
**Solution:** 
- Ensure `.env.local` has `NEXT_PUBLIC_SITE_URL=https://rentorent.net`
- Restart dev server or rebuild on production
- Clear browser cache

### Issue: Sitemap not accessible
**Solution:**
- Check if `src/app/sitemap.ts` exists
- Verify server is running
- Check Nginx configuration allows access to `/sitemap.xml`

### Issue: Metadata tools show old data
**Solution:**
- Use production URLs (not localhost)
- Clear cache in Facebook/Twitter debuggers
- Wait a few minutes for cache to refresh

---

## 📝 Notes

- The default fallback URL in code is now `https://rentorent.net`
- If `NEXT_PUBLIC_SITE_URL` is not set, it will use the fallback
- Always use `https://` in production (after SSL setup)
- Use `http://` only during initial setup before SSL

