import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { releases } from "@/lib/releases";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://hunterharris.top";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Hunter Harris — Music",
  description:
    "Listen to music by Hunter Harris on Spotify, Apple Music, and more.",
  keywords: ["Hunter Harris", "music", "pop", "artist", "Spotify", "Apple Music", "singles", "albums"],
  authors: [{ name: "Hunter Harris" }],
  openGraph: {
    title: "Hunter Harris — Music",
    description: "Listen to music by Hunter Harris on Spotify, Apple Music, and more.",
    url: siteUrl,
    siteName: "Hunter Harris Music",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hunter Harris — Music",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hunter Harris — Music",
    description: "Listen to music by Hunter Harris on Spotify, Apple Music, and more.",
    creator: "@hunterharrismus",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

// Generate structured data for MusicGroup + releases
function generateStructuredData() {
  const musicGroup = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Hunter Harris",
    url: siteUrl,
    image: `${siteUrl}/og-image.jpg`,
    sameAs: [
      "https://instagram.com/hunterharrismusic",
      "https://tiktok.com/@hunterharrismusic",
      "https://open.spotify.com/artist/4wNITMPxEv0bGbfrbyBaYl",
    ],
  };

  const musicReleases = releases.map((release) => ({
    "@context": "https://schema.org",
    "@type": release.type === "album" ? "MusicAlbum" : release.type === "ep" ? "MusicAlbum" : "MusicRecording",
    name: release.title,
    description: release.subtitle,
    byArtist: {
      "@type": "MusicGroup",
      name: "Hunter Harris",
    },
    datePublished: release.releaseDate,
    image: `${siteUrl}${release.artworkPath}`,
    ...(release.type === "album" && { albumReleaseType: "https://schema.org/AlbumRelease" }),
    ...(release.type === "ep" && { albumReleaseType: "https://schema.org/EPRelease" }),
    ...(release.type === "single" && { albumReleaseType: "https://schema.org/SingleRelease" }),
  }));

  return [musicGroup, ...musicReleases];
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = generateStructuredData();

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
