"use client";

import { motion } from "framer-motion";
import type { ColorPalette } from "@/lib/types";

interface EdgeGradientProps {
  position: "top" | "bottom";
  palette: ColorPalette;
}

export default function EdgeGradient({ position, palette }: EdgeGradientProps) {
  const isTop = position === "top";

  // Use darkMuted for the gradient base color, fallback to dominant
  const gradientColor = palette.darkMuted || palette.dominant;

  // Gradient stops - same for both, opacity varies by position
  const gradientStops = isTop
    ? `linear-gradient(to bottom,
        ${gradientColor}99 0%,
        ${gradientColor}4D 30%,
        ${gradientColor}1A 60%,
        transparent 100%)`
    : `linear-gradient(to top,
        ${gradientColor}B3 0%,
        ${gradientColor}66 20%,
        ${gradientColor}33 40%,
        ${gradientColor}1A 60%,
        transparent 85%)`;

  // Height classes: mobile vs desktop
  // Top: 120px always
  // Bottom: 420px mobile (taller for text legibility), 120px desktop (matching top)
  const heightClass = isTop
    ? "h-[120px]"
    : "h-[420px] lg:h-[120px] landscape:h-[120px]";

  return (
    <motion.div
      className={`fixed left-0 right-0 pointer-events-none ${isTop ? "top-0" : "bottom-0"} ${heightClass}`}
      style={{ zIndex: 15 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Color gradient layer */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: gradientStops,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Backdrop blur layer with mask */}
      <div
        className={`absolute inset-0 ${isTop ? "edge-gradient-top" : "edge-gradient-bottom"}`}
        style={{
          backdropFilter: isTop ? "blur(16px)" : "blur(20px)",
          WebkitBackdropFilter: isTop ? "blur(16px)" : "blur(20px)",
        }}
      />
    </motion.div>
  );
}
