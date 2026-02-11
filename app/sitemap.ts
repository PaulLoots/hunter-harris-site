import { MetadataRoute } from "next";
import { releases } from "@/lib/releases";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://hunterharris.top";

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...releases.map((release) => ({
      url: `${siteUrl}/#${release.id}`,
      lastModified: new Date(release.releaseDate),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
