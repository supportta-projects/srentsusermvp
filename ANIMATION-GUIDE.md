# 🎨 Animation Performance Guide

## ✅ What We've Optimized

### 1. **Navbar Animations**
- ✅ Reduced animation duration from 0.5s to 0.3s for snappier feel
- ✅ Added cubic-bezier easing `[0.4, 0, 0.2, 1]` for smooth motion
- ✅ Added `will-change` properties for GPU acceleration
- ✅ Added hover states with `whileHover` and `whileTap` for better feedback
- ✅ Reduced delays from 0.1s to 0.05s for faster perceived performance

### 2. **GPU Acceleration**
- ✅ Added `transform: translateZ(0)` to force GPU acceleration
- ✅ Added `will-change: transform, opacity` to hint browser optimization
- ✅ Added `backface-visibility: hidden` to prevent flickering

### 3. **Backend Connection**
- ✅ Fixed login/register routes (removed old `/vendor` paths)
- ✅ Added timeout handling for auth session loading (3s timeout)
- ✅ Optimized auth context to prevent hanging
- ✅ Better error handling for missing Supabase config

### 4. **CSS Utilities**
- ✅ Added `.smooth-transition` utility class
- ✅ Added `.smooth-hover` utility class
- ✅ Added `.force-gpu` utility class for critical animations

## 🎯 Best Practices for Smooth Animations

### 1. **Use GPU-Accelerated Properties**
```css
/* ✅ Good - GPU accelerated */
transform: translateX(10px);
opacity: 0.5;

/* ❌ Bad - Causes repaint */
left: 10px;
width: 100px;
```

### 2. **Use will-change Sparingly**
```css
/* ✅ Good - Only on elements that will animate */
.animated-element {
  will-change: transform, opacity;
}

/* ❌ Bad - Don't use on everything */
* {
  will-change: transform; /* Too broad */
}
```

### 3. **Optimize Framer Motion**
```tsx
// ✅ Good - Fast, smooth animation
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
  style={{ willChange: 'transform, opacity' }}
>

// ❌ Bad - Too slow
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }} // Too long
>
```

### 4. **Use Cubic Bezier Easing**
```tsx
// ✅ Good - Natural motion
ease: [0.4, 0, 0.2, 1] // Material Design easing

// ❌ Bad - Linear feels robotic
ease: "linear"
```

### 5. **Batch Animations**
```tsx
// ✅ Good - Staggered but fast
transition={{ duration: 0.3, delay: index * 0.05 }}

// ❌ Bad - Too much delay
transition={{ duration: 0.5, delay: index * 0.2 }}
```

## 🔧 What to Maintain

### 1. **Animation Duration**
- Keep animations between **0.2s - 0.3s** for UI interactions
- Use **0.1s - 0.15s** for micro-interactions (hover, tap)
- Never exceed **0.5s** for UI animations

### 2. **Easing Functions**
- Use `cubic-bezier(0.4, 0, 0.2, 1)` for most animations
- Use `cubic-bezier(0.4, 0, 0.6, 1)` for exits
- Avoid `linear` and `ease-in-out` (feels unnatural)

### 3. **will-change Usage**
- Only add `will-change` to elements that **will** animate
- Remove `will-change` after animation completes
- Don't add to static elements

### 4. **Transform vs Position**
- Always use `transform` instead of `top/left/right/bottom`
- Use `transform: translateZ(0)` to force GPU acceleration
- Avoid animating `width` and `height` (causes layout shift)

### 5. **Performance Monitoring**
- Check Chrome DevTools Performance tab
- Look for "Layout" and "Paint" operations (should be minimal)
- Ensure animations run at 60fps

## 🚀 Quick Reference

### Smooth Navbar Animation
```tsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
  style={{ willChange: 'transform, opacity' }}
>
```

### Smooth Hover Effect
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
  className="smooth-hover"
>
```

### Smooth Menu Dropdown
```tsx
<motion.div
  initial={{ opacity: 0, y: -10, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -10, scale: 0.95 }}
  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
  style={{ willChange: 'transform, opacity' }}
>
```

## 📊 Performance Checklist

- [ ] All animations use `transform` and `opacity`
- [ ] Animation duration ≤ 0.3s
- [ ] `will-change` only on animated elements
- [ ] Cubic bezier easing used
- [ ] No layout shifts during animations
- [ ] 60fps performance maintained
- [ ] Reduced motion respected
- [ ] GPU acceleration enabled

## 🐛 Common Issues & Fixes

### Issue: Animations feel janky
**Fix**: Add `transform: translateZ(0)` and `will-change: transform`

### Issue: Animations too slow
**Fix**: Reduce duration to 0.2s-0.3s, use faster easing

### Issue: Layout shifts during animation
**Fix**: Use `transform` instead of `width/height/left/top`

### Issue: Auth loading hangs
**Fix**: Added 3s timeout in AuthContext

### Issue: Routes not working
**Fix**: Updated all `/vendor/*` routes to root paths

---

**Last Updated**: 2024

