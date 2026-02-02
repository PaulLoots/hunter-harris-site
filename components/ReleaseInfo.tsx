"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Release } from "@/lib/types";

interface ReleaseInfoProps {
  release: Release;
  direction?: "up" | "down";
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

export default function ReleaseInfo({ release, direction = "down" }: ReleaseInfoProps) {
  // Determine slide direction based on navigation
  const slideDistance = 20;
  const initialY = direction === "down" ? slideDistance : -slideDistance;
  const exitY = direction === "down" ? -slideDistance : slideDistance;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={release.id}
        initial={{ opacity: 0, y: initialY }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: exitY }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-center py-3 sm:py-6 no-select min-h-[140px] sm:min-h-[160px] flex flex-col justify-center"
        aria-live="polite"
        aria-atomic="true"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white drop-shadow-lg mb-2">
          {release.title}
        </h2>
        {release.subtitle && (
          <p className="text-lg sm:text-xl text-white/80 mb-2">
            {release.subtitle}
          </p>
        )}
        <p className="text-sm uppercase tracking-widest font-medium text-white/70">
          {getReleaseTypeLabel(release.type)} •{" "}
          {formatReleaseDate(release.releaseDate)}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
