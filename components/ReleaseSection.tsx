"use client";

import { Release } from "@/lib/types";
import AnimatedGradient from "./AnimatedGradient";
import Artwork from "./Artwork";
import StreamingLinks from "./StreamingLinks";
import { motion } from "framer-motion";

interface ReleaseSectionProps {
  release: Release;
  index: number;
  isActive?: boolean;
}

export default function ReleaseSection({
  release,
  index,
  isActive = false,
}: ReleaseSectionProps) {
  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getReleaseTypeLabel = (type: Release["type"]) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <section
      id={`release-${index}`}
      className="relative h-screen w-screen snap-start flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <AnimatedGradient palette={release.palette} isActive={isActive} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 py-12 w-full max-w-2xl">
        {/* Artwork */}
        <Artwork
          src={release.artworkPath}
          alt={`${release.title} artwork`}
          priority={index === 0}
        />

        {/* Release Info */}
        <motion.div
          className="flex flex-col items-center gap-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white drop-shadow-lg">
            {release.title}
          </h2>
          {release.subtitle && (
            <p className="text-lg sm:text-xl text-white/80">
              {release.subtitle}
            </p>
          )}
          <p className="text-sm uppercase tracking-widest font-medium text-white/70">
            {getReleaseTypeLabel(release.type)} •{" "}
            {formatReleaseDate(release.releaseDate)}
          </p>
        </motion.div>

        {/* Streaming Links */}
        <motion.div
          className="w-full flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <StreamingLinks links={release.streamingLinks} variant="stacked" />
        </motion.div>
      </div>
    </section>
  );
}
