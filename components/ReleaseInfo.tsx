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
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const getReleaseTypeLabel = (type: Release["type"]) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function ReleaseInfo({ release, direction = "down", desktopAlign = "center", introDelay = 0 }: ReleaseInfoProps) {
  // Convert milliseconds to seconds for framer-motion
  const delaySeconds = introDelay / 1000;
  // Determine slide direction based on navigation
  const slideDistance = 20;
  const initialY = direction === "down" ? slideDistance : -slideDistance;
  const exitY = direction === "down" ? -slideDistance : slideDistance;

  const alignClasses = desktopAlign === "left"
    ? "text-center lg:text-left landscape:text-left items-center lg:items-start landscape:items-start"
    : "text-center items-center";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={release.id}
        initial={{ opacity: 0, y: initialY }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: exitY }}
        transition={{ duration: 0.3, ease: "easeOut", delay: delaySeconds }}
        className={`py-1 no-select flex flex-col justify-center gap-0.5 lg:gap-1 ${alignClasses}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-white drop-shadow-lg leading-tight">
          {release.title}
        </h2>
        {release.subtitle && (
          <p className="text-sm sm:text-base lg:text-lg text-white/60 leading-snug max-w-[280px] lg:max-w-none">
            {release.subtitle}
          </p>
        )}
        <p className="text-[11px] sm:text-xs lg:text-sm uppercase tracking-[0.2em] font-medium text-white/40 mt-1 lg:mt-2">
          {getReleaseTypeLabel(release.type)} · {formatReleaseDate(release.releaseDate)}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
