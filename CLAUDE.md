# Hunter Harris Music Portfolio - AI Assistant Guide

## Project Context

This is a premium, mobile-first music portfolio website for pop artist **Hunter Harris**. The site's sole purpose is to showcase music releases and funnel visitors to streaming platforms with zero friction.

**Design Philosophy:** Cinematic, intimate, and modern — like a high-end artist EPK meets Apple Music's visual polish. The vibe is premium, dark, cinematic, and emotionally resonant — not flashy or busy.

## Architecture Overview

### Tech Stack
- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS 3.4** (utility-first styling)
- **Framer Motion 11** (3D transforms, gestures, spring animations)
- **node-vibrant** (color extraction from artwork)
- **Inter font** via next/font

### Core Experience
- **Horizontal CoverFlow carousel** with 3D perspective transforms
- **Infinite loop scrolling** (wraps around, no start/finish)
- **Touch-optimized drag gestures** with momentum physics
- **Multi-layer parallax gradients** derived from artwork colors
- **Signature logo** in header (SVG)
- **Directional release info** that slides left/right based on navigation
- **Prominent streaming links** (Spotify, Apple Music only)

## Project Structure

```
app/
├── layout.tsx          # Root layout, fonts, SEO metadata
├── page.tsx            # Main page with CoverFlow carousel
└── globals.css         # Tailwind + 3D transforms + parallax gradients

components/
├── CoverFlow.tsx       # Main carousel container (infinite scroll logic)
├── CoverFlowItem.tsx   # Individual 3D artwork card with transforms
├── ReleaseInfo.tsx     # Title, subtitle, release date with directional fade
├── AnimatedGradient.tsx # Multi-layer parallax background
├── StreamingLinks.tsx  # Platform buttons (Spotify, Apple Music)
└── SocialFooter.tsx    # Fixed footer with social links

lib/
├── types.ts            # TypeScript interfaces
├── releases.ts         # **SINGLE SOURCE OF TRUTH** for release data
└── releases.generated.ts # Auto-generated (don't edit)

scripts/
└── generate-palettes.ts # Extracts colors from artwork

public/
├── artwork/            # Square JPG images (800x800px min)
└── hunter-harris-signature.svg # Logo
```

## Single Source of Truth: lib/releases.ts

**CRITICAL:** The entire site is data-driven from `lib/releases.ts`. To add/remove/edit releases, ONLY edit this file.

```typescript
export const releases: Release[] = [
  {
    id: "unique-slug",
    title: "Release Title",
    subtitle: "Optional tagline or description",
    type: "album" | "ep" | "single",
    releaseDate: "2025-02-13", // ISO format
    artworkPath: "/artwork/filename.jpg",
    palette: { /* colors auto-generated */ },
    streamingLinks: {
      spotify: "https://...",
      appleMusic: "https://...",
      // Note: YouTube Music removed
    },
    featured: true, // optional
  },
  // ... more releases (newest first)
]
```

## Component Hierarchy

```
page.tsx
├── AnimatedGradient (multi-layer parallax background)
├── Header (signature logo SVG)
├── CoverFlow (carousel container)
│   └── CoverFlowItem (for each visible release)
│       └── Image (artwork with 3D transforms)
├── ReleaseInfo (title, subtitle, metadata with directional fade)
├── StreamingLinks (Spotify, Apple Music buttons)
└── SocialFooter
```

## Key Implementation Details

### 1. CoverFlow 3D Transforms
- **Perspective**: 1200px for depth perception
- **Progressive transforms**: Items further from center have more rotation, depth, and smaller scale
- **Spacing**: 45% for items ±1, ±2 from center; 28% for items ±3+
- **Rotation**: 0° (center) → 55° (±1) → 80° (±2) → 85° (±3+)
- **Depth**: translateZ 0px (center) → -180px (±1) → -320px (±2) → -400px (±3+)
- **Scale**: 1.0 (center) → 0.9 (±1) → 0.82 (±2) → 0.75 (±3+)
- **Entry animation**: Items "deal in" from right on page load with staggered timing

### 2. Infinite Loop Scrolling
- **Modulo arithmetic**: Index wraps using `(index % releases.length)`
- **Sliding window rendering**: Renders ±8 items from current position
- **No boundaries**: Can scroll infinitely in either direction
- **Continuous position tracking**: Uses Framer Motion `MotionValue` for real-time drag updates

### 3. Gesture & Momentum Physics
- **Drag sensitivity**: 350px horizontal drag = 1 item movement
- **Smart snap**: Ignores momentum for small drags (<0.4 items or <800px/s velocity)
- **Velocity-based momentum**: Fast flicks skip 2-4 items, gentle swipes move 1 item
- **Spring physics**: stiffness 200, damping 30, mass 1.0 for smooth settling
- **Keyboard support**: Arrow keys navigate left/right

### 4. Multi-Layer Parallax Gradients
- **3 layers** with different animation speeds:
  - Back layer: 25s (slowest, darkMuted + darkVibrant)
  - Middle layer: 17s (medium, muted + vibrant)
  - Front layer: 12s (fastest, lightVibrant + lightMuted)
- **Progressive opacity**: 0.3-0.4 (back), 0.5-0.6 (middle), 0.6-0.8 (front)
- **Offset delays**: -3s, -7s to prevent synchronization
- **GPU-accelerated**: transform + background-position animations

### 5. Color Extraction
- Build script: `scripts/generate-palettes.ts`
- Reads artwork, extracts 7 colors via node-vibrant
- Generates `lib/releases.generated.ts`
- Runs automatically on `npm run build` (prebuild script)

### 6. Performance Optimizations
- First CoverFlow item: `priority={true}` (LCP)
- Only ±8 items rendered at a time (sliding window)
- GPU-accelerated transforms (translateX/Z, rotateY, scale)
- MotionValue prevents React re-renders during drag
- `will-change: transform` on active elements

### 7. Accessibility
- Semantic HTML (main, header, nav, footer)
- ARIA labels on carousel and buttons
- Keyboard navigation (arrow keys)
- Focus visible states
- **Reduced motion support**:
  - Disables all parallax animations
  - Disables 3D transforms (flat mode)
  - Simple fade instead of directional slides

## Common Editing Tasks

### Add a New Release
1. Add artwork to `public/artwork/` (square JPG, ≥800x800px)
2. Edit `lib/releases.ts` - add release object to array (newest first)
3. Run `npm run prebuild` to extract colors
4. Done! The site rebuilds automatically

### Update Streaming Links
Edit the `streamingLinks` object in `lib/releases.ts`. Only Spotify and Apple Music are supported (YouTube Music was removed).

### Change Social Media Links
Edit `app/page.tsx`:
```typescript
<SocialFooter
  instagram="https://instagram.com/hunterharrismusic"
  tiktok="https://tiktok.com/@hunterharrismusic"
/>
```

### Update SEO Metadata
Edit `app/layout.tsx` metadata export

### Customize Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --background-base: #0a0a0a;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}
```

### Adjust CoverFlow Spacing
Edit `components/CoverFlowItem.tsx` transform calculation:
```typescript
// Progressive spacing
if (absOffset <= 2) {
  translateX = offset * 45;  // Close items
} else {
  translateX = offset * 28;  // Peripheral items
}
```

### Adjust Drag Sensitivity
Edit `components/CoverFlow.tsx` handlePan:
```typescript
const dragProgress = -info.offset.x / 350; // Increase = less sensitive
```

### Adjust Gradient Animation Speed
Edit `app/globals.css` keyframes:
```css
animation: gradientShiftSlow 25s ease-in-out infinite;  /* Adjust duration */
animation: gradientShiftMedium 17s ease-in-out infinite;
animation: gradientShiftFast 12s ease-in-out infinite;
```

## Development Workflow

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Extract colors from artwork
npm run prebuild

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Styling Conventions

### Mobile-First Approach
Default styles are mobile. Use Tailwind breakpoints:
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+

### Component Patterns
- All components use `"use client"` (client-side rendering)
- Framer Motion for 3D transforms and gestures
- Tailwind utilities preferred over custom CSS
- CSS variables for dynamic gradient colors

### Typography Scale
- Release title: `text-3xl sm:text-4xl font-semibold tracking-tight`
- Subtitle: `text-lg sm:text-xl text-white/80`
- Metadata: `text-sm uppercase tracking-widest font-medium text-white/70`
- Buttons: `text-base font-medium`

### Interaction Classes
- `.no-select` - Prevents text selection during drag
- `.no-drag` - Prevents image dragging
- `.perspective-container` - Applies 3D perspective (1200px)
- `.preserve-3d` - Maintains 3D transform style

## Troubleshooting

### Colors Not Extracting
- Verify artwork exists in `public/artwork/`
- Check paths in `lib/releases.ts` match files
- Ensure images are valid JPGs
- Run `npm run prebuild` manually

### Build Errors
- Run `npm install` to restore dependencies
- Check TypeScript errors: `npm run lint`
- Verify all imports use `@/` alias

### Images Not Loading in CoverFlow
- Confirm `artworkPath` matches actual file
- Check file extensions (.jpg recommended)
- Ensure images are in `public/artwork/`
- Verify render range is ±8 items (check `CoverFlow.tsx` line 197)

### CoverFlow Not Dragging Smoothly
- Check drag sensitivity in `CoverFlow.tsx` (line 113)
- Verify spring physics values (stiffness: 200, damping: 30)
- Test on real device (touch may differ from mouse)
- Ensure no CSS `pointer-events: none` on carousel

### 3D Transforms Not Working
- Verify `perspective-container` class on parent
- Check `preserve-3d` class on transform elements
- Ensure browser supports 3D CSS transforms
- Test in different browser (Safari can be finicky)

### Items Too Close or Too Far Apart
- Adjust progressive spacing in `CoverFlowItem.tsx` (lines 40-44)
- Check rotation values aren't creating visual overlap
- Verify scale progression matches spacing

## Design Principles

1. **Mobile Experience IS the Experience**
   - Desktop just gets more whitespace
   - All interactions optimized for touch
   - Drag gestures feel natural and responsive

2. **Breathing Room**
   - When in doubt, add more space
   - Generous gaps between elements
   - No cramped layouts

3. **Physically Realistic Animations**
   - Spring physics (no easing curves)
   - Momentum-based scrolling
   - Overshoot and settle behavior
   - 60fps target on mid-range devices

4. **Glass Morphism**
   - White overlays with low opacity
   - Backdrop blur effects
   - Subtle borders
   - Pill-shaped buttons

5. **Content Hierarchy**
   - Artwork is the hero (largest element)
   - Title is secondary (clear but not dominant)
   - Metadata is tertiary (subtle)
   - Buttons are prominent but not flashy

6. **Atmospheric Depth**
   - Multi-layer gradients create living background
   - 3D transforms add spatial dimension
   - Progressive blur/scale enhance depth perception
   - Color-driven mood (from artwork palette)

## Performance Targets

- **LCP:** <2.5s (first CoverFlow item with priority)
- **FID:** <100ms (gesture response)
- **CLS:** 0 (all dimensions known upfront)
- **Frame Rate:** 60fps during drag/animation
- **Bundle Size:** <150KB JS (excluding images)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Android 90+

**Required Features:**
- CSS 3D Transforms
- Framer Motion gesture support
- ES2017+
- MotionValue API

## Future Considerations (Not Yet Implemented)

If you're asked to add these, here's the approach:

### Audio Previews
- Add `previewUrl` to Release interface
- Create AudioPlayer component
- Position below streaming links
- Pause on carousel navigation

### Glow Effect on Active Item
- Add radial gradient behind active artwork
- Use `palette.vibrant` for glow color
- Blur 40px, scale 1.15, opacity 0.8
- Animate on/off with spring physics

### Letter-by-Letter Title Animation
- Split `release.title` into characters
- Use Framer Motion staggerChildren
- 30ms delay between letters
- Fade + rise + blur-to-sharp effect

### Analytics
- Add Google Analytics or Plausible
- Track: carousel interactions, button clicks, drag distance
- Privacy-conscious approach

### CMS Integration
- Could use Sanity, Contentful, or Strapi
- Fetch releases at build time (ISR)
- Keep color extraction in build pipeline

## AI Assistant Instructions

When working on this project:

1. **Always check `lib/releases.ts` first** - it's the data source
2. **Preserve the mobile-first approach** - don't break responsive design
3. **Test 3D transforms on real devices** - Safari behavior differs from Chrome
4. **Respect reduced motion preferences** - accessibility is critical
5. **Don't over-engineer** - keep it simple and focused
6. **Maintain the aesthetic** - dark, cinematic, intimate, physically realistic
7. **Use progressive transforms** - items further from center get more extreme transforms
8. **Check `globals.css` for custom animations** - don't duplicate gradient keyframes
9. **Run `npm run prebuild` after artwork changes** - colors need updating
10. **Test drag gestures on touch devices** - mouse behaves differently

## Questions to Ask Before Making Changes

- Does this align with the cinematic/intimate aesthetic?
- Is this mobile-first and touch-optimized?
- Will this impact 60fps performance during drag?
- Does this respect reduced motion preferences?
- Is this over-engineering the solution?
- Have I checked the existing CoverFlow logic first?
- Does this maintain the physically realistic feel?

## Success Criteria

A change is successful if:
- ✅ Mobile touch gestures feel natural and responsive
- ✅ CoverFlow animations run at 60fps
- ✅ 3D transforms work across all browsers
- ✅ Infinite scrolling has no visual glitches
- ✅ Accessibility is maintained (keyboard nav, reduced motion)
- ✅ Build process still works
- ✅ Code follows existing patterns
- ✅ Visual hierarchy is preserved
- ✅ No layout shift occurs
- ✅ Progressive transforms create depth perception

---

**Last Updated:** February 2025
**Maintained By:** Hunter Harris Team
**For AI Assistants:** This file provides context for working on the codebase. Always read this before making significant changes.
