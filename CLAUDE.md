# Hunter Harris Music Portfolio - AI Assistant Guide

## Project Context

This is a premium, mobile-first music portfolio website for pop artist **Hunter Harris**. The site's sole purpose is to showcase music releases and funnel visitors to streaming platforms with zero friction.

**Design Philosophy:** Cinematic, intimate, and modern — like a high-end artist EPK meets Apple Music's visual polish. The vibe is premium, dark, cinematic, and emotionally resonant — not flashy or busy.

## Architecture Overview

### Tech Stack
- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS 3.4** (utility-first styling)
- **Framer Motion 11** (scroll animations, parallax)
- **node-vibrant** (color extraction from artwork)
- **Inter font** via next/font

### Core Experience
- Full-viewport vertical sections (one per release)
- Smooth snap-scrolling between sections
- Animated gradients derived from artwork colors
- Parallax effects on artwork
- Prominent streaming platform links
- Minimal dot navigation for quick jumps

## Project Structure

```
app/
├── layout.tsx          # Root layout, fonts, SEO metadata
├── page.tsx            # Main page with snap scrolling
└── globals.css         # Tailwind + custom gradient animations

components/
├── ReleaseSection.tsx  # Full-viewport section (main component)
├── AnimatedGradient.tsx # Morphing gradient background
├── Artwork.tsx         # Optimized image with parallax
├── StreamingLinks.tsx  # Platform buttons (Spotify, Apple, YouTube)
├── DotNavigation.tsx   # Vertical dot pagination
└── SocialFooter.tsx    # Fixed footer with social links

lib/
├── types.ts            # TypeScript interfaces
├── releases.ts         # **SINGLE SOURCE OF TRUTH** for release data
└── releases.generated.ts # Auto-generated (don't edit)

scripts/
└── generate-palettes.ts # Extracts colors from artwork

public/artwork/
└── [release-artwork]   # Square images (800x800px min)
```

## Single Source of Truth: lib/releases.ts

**CRITICAL:** The entire site is data-driven from `lib/releases.ts`. To add/remove/edit releases, ONLY edit this file.

```typescript
export const releases: Release[] = [
  {
    id: "unique-slug",
    title: "Release Title",
    type: "album" | "ep" | "single",
    releaseDate: "2025-02-13", // ISO format
    artworkPath: "/artwork/filename.jpg",
    palette: { /* colors auto-generated */ },
    streamingLinks: {
      spotify: "https://...",
      appleMusic: "https://...",
      youtubeMusic: "https://...",
    },
    featured: true, // optional
  },
  // ... more releases (newest first)
]
```

## Component Hierarchy

```
page.tsx
├── ReleaseSection (for each release)
│   ├── AnimatedGradient
│   ├── Artwork
│   └── StreamingLinks
├── DotNavigation
└── SocialFooter
```

## Key Implementation Details

### 1. Snap Scrolling
- Container: `.snap-y .snap-mandatory`
- Sections: `.snap-start`
- Intersection Observer tracks active section
- Dot navigation triggers smooth scroll

### 2. Animated Gradients
- CSS keyframe animation (15s loop)
- Uses custom properties from color palette
- GPU-accelerated (transform, not repaint)
- Respects prefers-reduced-motion

### 3. Color Extraction
- Build script: `scripts/generate-palettes.ts`
- Reads artwork, extracts 7 colors via node-vibrant
- Generates `lib/releases.generated.ts`
- Runs automatically on `npm run build` (prebuild script)

### 4. Performance Optimizations
- First release artwork: `priority={true}` (LCP)
- Other images: lazy-loaded
- next/image with responsive sizing
- Minimal JS (most animation is CSS)

### 5. Accessibility
- Semantic HTML (main, section, nav, footer)
- ARIA labels on all buttons/links
- Keyboard navigation support
- Focus visible states
- Reduced motion support

## Common Editing Tasks

### Add a New Release
1. Add artwork to `public/artwork/` (square, ≥800x800px)
2. Edit `lib/releases.ts` - add release object to array
3. Run `npm run prebuild` to extract colors
4. Done! The site rebuilds automatically

### Update Streaming Links
Edit the `streamingLinks` object in `lib/releases.ts`

### Change Social Media Links
Edit `app/page.tsx` around line 51:
```typescript
<SocialFooter
  instagram="https://instagram.com/username"
  tiktok="https://tiktok.com/@username"
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

### Adjust Animation Speed
Edit `globals.css` line ~28:
```css
animation: gradientShift 15s ease-in-out infinite;
/* Change 15s to adjust */
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
- Framer Motion for scroll-triggered animations
- Tailwind utilities preferred over custom CSS
- No inline styles except dynamic CSS variables

### Typography Scale
- Release title: `text-3xl sm:text-4xl font-semibold tracking-tight`
- Metadata: `text-sm uppercase tracking-widest font-medium opacity-70`
- Buttons: `text-base font-medium`

## Troubleshooting

### Colors Not Extracting
- Verify artwork exists in `public/artwork/`
- Check paths in `lib/releases.ts` match files
- Ensure images are valid (JPG, PNG, or SVG)
- Run `npm run prebuild` manually

### Build Errors
- Run `npm install` to restore dependencies
- Check TypeScript errors: `npm run lint`
- Verify all imports use `@/` alias

### Images Not Loading
- Confirm `artworkPath` matches actual file
- Check file extensions (.jpg, .png, .svg)
- Ensure images are in `public/artwork/`

### Scroll Issues
- Check browser supports CSS scroll-snap
- Verify sections have `snap-start` class
- Ensure container has `snap-y snap-mandatory`

## Design Principles

1. **Mobile Experience IS the Experience**
   - Desktop just gets more whitespace
   - All interactions optimized for touch

2. **Breathing Room**
   - When in doubt, add more space
   - Generous gaps between elements

3. **Subtle Animations**
   - 400-600ms durations
   - Ease-out transitions
   - No jarring movements

4. **Glass Morphism**
   - White overlays with low opacity
   - Backdrop blur effects
   - Subtle borders

5. **Content Hierarchy**
   - Artwork is the hero
   - Title is secondary
   - Metadata is tertiary
   - Buttons are prominent but not dominant

## Performance Targets

- **LCP:** <2.5s (first artwork with priority prop)
- **FID:** <100ms (minimal JS)
- **CLS:** 0 (all dimensions known upfront)
- **Bundle Size:** <100KB JS (excluding images)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Android 90+

**Required Features:**
- CSS Grid
- CSS Scroll Snap
- Intersection Observer
- ES2017+

## Future Considerations (Not Yet Implemented)

If you're asked to add these, here's the approach:

### Audio Previews
- Add `previewUrl` to Release interface
- Create AudioPlayer component
- Use HTML5 `<audio>` element
- Position below streaming links

### CMS Integration
- Could use Sanity, Contentful, or Strapi
- Fetch releases at build time (ISR)
- Keep color extraction in build pipeline

### Analytics
- Add Google Analytics or Plausible
- Track: page views, button clicks, scroll depth
- Privacy-conscious approach

### Merch/Tour Sections
- Add new section types to Release interface
- Create dedicated components
- Maintain snap-scroll behavior

## AI Assistant Instructions

When working on this project:

1. **Always check `lib/releases.ts` first** - it's the data source
2. **Preserve the mobile-first approach** - don't break responsive design
3. **Test animations with reduced motion** - accessibility is critical
4. **Don't over-engineer** - keep it simple and focused
5. **Maintain the aesthetic** - dark, cinematic, intimate
6. **Use the existing component patterns** - consistency matters
7. **Check `globals.css` for custom animations** - don't duplicate
8. **Run `npm run prebuild` after artwork changes** - colors need updating

## Questions to Ask Before Making Changes

- Does this align with the cinematic/intimate aesthetic?
- Is this mobile-first?
- Will this impact performance?
- Does this respect reduced motion preferences?
- Is this over-engineering the solution?
- Have I checked the existing components first?

## Success Criteria

A change is successful if:
- ✅ Mobile experience is excellent
- ✅ Animations are smooth (60fps)
- ✅ Accessibility is maintained
- ✅ Build process still works
- ✅ Code follows existing patterns
- ✅ Visual hierarchy is preserved
- ✅ No layout shift occurs

---

**Last Updated:** February 2025
**Maintained By:** Hunter Harris Team
**For AI Assistants:** This file provides context for working on the codebase. Always read this before making significant changes.
