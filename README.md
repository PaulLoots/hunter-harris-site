# Hunter Harris Music Portfolio

A premium, mobile-first single-page music portfolio site showcasing Hunter Harris's releases with animated gradients, parallax effects, and seamless streaming platform integration.

## Featuress

- **Full-viewport sections** with snap scrolling
- **Animated gradients** derived from album artwork colors
- **Parallax effects** on artwork images
- **Mobile-first responsive design**
- **Streaming platform integration** (Spotify, Apple Music, YouTube Music)
- **Accessibility features** including reduced motion support
- **Performance optimized** with Next.js Image optimization

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
npm start
```

The `prebuild` script will automatically extract color palettes from your artwork before building.

## Adding or Editing Releases

### 1. Add Artwork

Place your album/single artwork in the `public/artwork/` directory. Supported formats:
- JPG (recommended for photos)
- PNG (for transparency)
- SVG (current placeholders)

Recommended dimensions: **Square (1:1 ratio)**, minimum 800x800px

### 2. Update Release Data

Edit `lib/releases.ts` to add or modify releases:

```typescript
{
  id: "your-release-id",
  title: "Your Release Title",
  subtitle: "Optional featured artist", // Optional
  type: "album" | "ep" | "single",
  releaseDate: "2025-02-13", // ISO date string
  artworkPath: "/artwork/your-artwork.jpg",
  palette: {
    // Colors will be auto-generated, but you can set defaults
    vibrant: "#ff6b9d",
    darkVibrant: "#c9184a",
    // ... etc
  },
  streamingLinks: {
    spotify: "https://open.spotify.com/...",
    appleMusic: "https://music.apple.com/...",
    youtubeMusic: "https://music.youtube.com/...",
  },
  featured: true, // Optional, for hero treatment
}
```

**Note:** Releases are displayed in the order they appear in the array. The newest release should be first.

### 3. Color Extraction

The color palette is automatically extracted from your artwork during the build process. To manually run the extraction:

```bash
npm run prebuild
```

This creates `lib/releases.generated.ts` with extracted colors.

## Project Structure

```
hunter-harris-site/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main page with scroll sections
│   └── globals.css         # Global styles and animations
├── components/
│   ├── ReleaseSection.tsx  # Full-viewport release card
│   ├── StreamingLinks.tsx  # Platform buttons
│   ├── DotNavigation.tsx   # Scroll navigation dots
│   ├── AnimatedGradient.tsx # Animated background
│   ├── SocialFooter.tsx    # Social media links
│   └── Artwork.tsx         # Image with parallax
├── lib/
│   ├── releases.ts         # Release data (edit this!)
│   ├── types.ts            # TypeScript interfaces
│   └── releases.generated.ts # Auto-generated (don't edit)
├── public/
│   └── artwork/            # Album artwork images
└── scripts/
    └── generate-palettes.ts # Color extraction script
```

## Customization

### Social Links

Update social media links in `app/page.tsx`:

```typescript
<SocialFooter
  instagram="https://instagram.com/yourusername"
  tiktok="https://tiktok.com/@yourusername"
/>
```

### Metadata & SEO

Edit metadata in `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your Name — Music",
  description: "Your custom description",
  // ... update OpenGraph and Twitter cards
}
```

### Colors & Styling

- **CSS Variables:** Edit `app/globals.css` for global color tokens
- **Tailwind Config:** Modify `tailwind.config.ts` for theme customization
- **Gradient Animation:** Adjust animation timing and effects in `globals.css`

## Performance Tips

1. **Optimize Images:** Use high-quality but compressed artwork (aim for <500KB per image)
2. **First Release Priority:** The first release's artwork is loaded with priority for better LCP
3. **Lazy Loading:** All other images are lazy-loaded automatically
4. **Reduced Motion:** Animations respect user's motion preferences

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will auto-detect Next.js and deploy
4. Connect your custom domain in Vercel settings

The `prebuild` script runs automatically during deployment.

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Self-hosted with `npm run build && npm start`

## Browser Support

- **Modern browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile:** iOS Safari 14+, Chrome Android 90+
- **Features:** Snap scrolling, CSS Grid, Intersection Observer

## Accessibility

- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **Screen Readers:** Semantic HTML with proper ARIA labels
- **Reduced Motion:** Respects `prefers-reduced-motion` setting
- **Focus States:** Clear focus indicators for keyboard navigation
- **Color Contrast:** WCAG AA compliant contrast ratios

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 3.4
- **Animation:** Framer Motion 11
- **Color Extraction:** node-vibrant
- **Font:** Inter (Google Fonts)
- **Language:** TypeScript

## Troubleshooting

### Colors not extracting

Make sure your artwork files exist in `public/artwork/` and match the paths in `lib/releases.ts`.

### Snap scrolling not working

Check that your browser supports CSS scroll-snap. For older browsers, scrolling will still work but won't snap.

### Images not loading

Verify the `artworkPath` in your release data matches the actual file in `public/artwork/`.

## License

© 2025 Hunter Harris. All rights reserved.

## Support

For issues or questions, please contact [your contact info].
