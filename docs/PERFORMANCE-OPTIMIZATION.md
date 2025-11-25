# ⚡ Performance Optimization Guide

This document explains why your website might be slow and how to fix it.

## 🐌 Common Performance Issues

### 1. **External Image Sources (Unsplash)**
**Problem**: Images loaded from `images.unsplash.com` can be slow because:
- External CDN latency
- No control over caching
- Large file sizes (800x600, 1200x800)
- Network distance from server

**Impact**: Images can take 2-5 seconds to load, blocking page rendering.

### 2. **Short Cache TTL (60 seconds)**
**Problem**: `minimumCacheTTL: 60` means images are re-fetched every minute.

**Impact**: Repeated requests slow down subsequent page loads.

### 3. **Missing Image Optimization**
**Problem**: Some images use regular `<img>` tags instead of Next.js `<Image>` component.

**Impact**: No automatic optimization, format conversion, or responsive sizing.

### 4. **No Image Priority**
**Problem**: Above-the-fold images don't have `priority` prop.

**Impact**: Critical images load last, causing layout shift.

### 5. **Large Bundle Size**
**Problem**: Heavy dependencies:
- Firebase (~500KB)
- Framer Motion (~200KB)
- Other libraries

**Impact**: Slow initial page load, especially on mobile.

### 6. **No Lazy Loading**
**Problem**: All images load immediately instead of on-demand.

**Impact**: Unnecessary bandwidth usage, slower initial load.

---

## ✅ Solutions & Fixes

### Fix 1: Increase Cache TTL

**File**: `next.config.ts`

```typescript
images: {
  // ... existing config
  minimumCacheTTL: 31536000, // 1 year (in seconds)
}
```

**Why**: Images don't change often, so cache them longer.

### Fix 2: Use Next.js Image Component Everywhere

**Before** (Slow):
```tsx
<img src="/image.jpg" alt="Description" />
```

**After** (Fast):
```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  quality={85}
/>
```

**Why**: Automatic optimization, format conversion, responsive sizing.

### Fix 3: Add Priority to Above-the-Fold Images

```tsx
<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={1200}
  height={800}
  priority // Load immediately
  quality={90}
/>
```

**Why**: Critical images load first, improving perceived performance.

### Fix 4: Optimize Image Sizes

**Before**: 1200x800 (960KB)
**After**: Use appropriate sizes:
- Hero images: 1200x800 (but optimized)
- Product cards: 400x300
- Thumbnails: 200x150

**How**: Use Next.js Image `sizes` prop:

```tsx
<Image
  src="/product.jpg"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Fix 5: Move Images to Your CDN

**Current**: `images.unsplash.com` (external, slow)
**Better**: Upload to:
- Vercel Blob Storage
- Cloudinary
- Your own CDN

**Why**: Faster, more control, better caching.

### Fix 6: Enable Image Format Optimization

Already configured, but ensure it's working:

```typescript
formats: ['image/avif', 'image/webp'], // Modern formats (smaller)
```

**Why**: AVIF/WebP are 30-50% smaller than JPEG.

### Fix 7: Lazy Load Below-the-Fold Images

```tsx
<Image
  src="/image.jpg"
  width={800}
  height={600}
  loading="lazy" // Default, but be explicit
  placeholder="blur" // Optional: blur placeholder
/>
```

### Fix 8: Reduce Bundle Size

**Option A**: Code splitting
```tsx
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

**Option B**: Remove unused dependencies
```bash
# Check bundle size
npm run build
# Look for large chunks
```

### Fix 9: Optimize Framer Motion

**Before**:
```tsx
<motion.div animate={{ ... }} />
```

**After**: Use CSS animations for simple effects:
```tsx
<div className="animate-fade-in" />
```

**Why**: CSS animations are faster than JavaScript.

### Fix 10: Enable Compression

Already enabled, but verify:
```typescript
compress: true, // ✅ Already set
```

---

## 🚀 Quick Wins (Implement First)

### Priority 1: Image Optimization
1. ✅ Increase cache TTL to 1 year
2. ✅ Add `priority` to hero images
3. ✅ Use Next.js Image component everywhere
4. ✅ Add proper `sizes` attribute

### Priority 2: Bundle Optimization
1. ✅ Lazy load heavy components
2. ✅ Remove unused dependencies
3. ✅ Use dynamic imports

### Priority 3: CDN Migration
1. ✅ Move images to Vercel Blob or Cloudinary
2. ✅ Use optimized image URLs

---

## 📊 Performance Metrics

### Target Metrics
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1

### How to Measure
1. **Lighthouse** (Chrome DevTools)
   - Open DevTools → Lighthouse
   - Run audit

2. **WebPageTest**
   - Visit [webpagetest.org](https://webpagetest.org)
   - Test your URL

3. **Vercel Analytics**
   - Already integrated
   - Check dashboard

---

## 🔧 Implementation Steps

### Step 1: Update Next.js Config

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // ✅ Changed from 60 to 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // ... rest of config
};
```

### Step 2: Update Image Components

Find all `<img>` tags and replace with `<Image>`:

```bash
# Search for img tags
grep -r "<img" src/
```

### Step 3: Add Priority to Hero Images

```tsx
// src/components/vendor/VendorHero.tsx
<Image
  src="/svg/rentalDashboard.svg"
  alt="Rental Business Dashboard"
  width={800}
  height={800}
  priority // ✅ Add this
  quality={90}
/>
```

### Step 4: Optimize External Images

For Unsplash images, use their optimization API:

```typescript
// Before
'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'

// After (optimized)
'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop&q=80&auto=format'
```

---

## 📈 Expected Improvements

After implementing these fixes:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| LCP | 4-6s | 1.5-2.5s | **60-70% faster** |
| Image Load Time | 3-5s | 0.5-1s | **80% faster** |
| Bundle Size | ~2MB | ~1.2MB | **40% smaller** |
| Cache Hit Rate | 10% | 90%+ | **9x better** |

---

## 🎓 For Beginners

### Why Images Are Slow

1. **External Sources**: Loading from Unsplash means:
   - Request goes to Unsplash server (far away)
   - Large files (800KB+)
   - No optimization

2. **No Caching**: Images re-download every time

3. **Wrong Format**: JPEG instead of WebP/AVIF

### How Next.js Image Helps

- **Automatic Optimization**: Converts to WebP/AVIF
- **Responsive Sizing**: Serves right size for device
- **Lazy Loading**: Loads when needed
- **Caching**: Caches optimized versions

### Simple Fixes You Can Do Now

1. **Increase cache time** (1 line change)
2. **Add `priority` to hero images** (1 prop)
3. **Use Next.js Image** (replace `<img>`)

---

## 🔍 Monitoring

### Check Performance Regularly

1. **Weekly**: Run Lighthouse audit
2. **Monthly**: Review Vercel Analytics
3. **After Changes**: Test before/after

### Tools

- **Lighthouse**: Built into Chrome
- **WebPageTest**: Detailed analysis
- **Vercel Analytics**: Real user metrics
- **Chrome DevTools**: Network tab

---

## 📝 Checklist

Before deploying:

- [ ] Increased cache TTL to 1 year
- [ ] All images use Next.js `<Image>` component
- [ ] Hero images have `priority` prop
- [ ] Images have proper `sizes` attribute
- [ ] Heavy components are lazy loaded
- [ ] Bundle size is optimized
- [ ] Lighthouse score > 90

---

**Document Version**: 1.0  
**Last Updated**: 2024

