"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Release } from "@/lib/types";

interface ReleaseInfoProps {
  release: Release;
  direction?: "up" | "down";
  desktopAlign?: "center" | "left";
  introDelay?: number; // milliseconds
}

const formatReleaseDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

const getReleaseTypeLabel = (type: Release["type"]) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function ReleaseInfo({ release, direction = "down", desktopAlign = "center", introDelay = 0 }: ReleaseInfoProps) {
  // Convert milliseconds to seconds for framer-motion
  const delaySeconds = introDelay / 1000;

  const alignClasses = desktopAlign === "left"
    ? "text-center lg:text-left landscape:text-left items-center lg:items-start landscape:items-start"
    : "text-center items-center";

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={release.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: delaySeconds }}
        className={`py-1 no-select flex flex-col justify-center gap-1.5 lg:gap-2 ${alignClasses}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white drop-shadow-lg leading-tight">
          {release.title}
        </h2>
        {release.subtitle && (
          <p className="text-base sm:text-lg lg:text-xl text-white/70 italic leading-snug max-w-[320px] lg:max-w-none">
            {release.subtitle}
          </p>
        )}
        <p className="text-[11px] sm:text-xs lg:text-sm uppercase tracking-[0.15em] font-medium text-white/50 mt-2 lg:mt-3">
          {getReleaseTypeLabel(release.type)} · {formatReleaseDate(release.releaseDate)}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
