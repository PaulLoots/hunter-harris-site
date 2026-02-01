"use client";

import { ColorPalette } from "@/lib/types";
import { motion } from "framer-motion";

interface AnimatedGradientProps {
  palette: ColorPalette;
  isActive?: boolean;
}

export default function AnimatedGradient({
  palette,
  isActive = true,
}: AnimatedGradientProps) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
      {/* Back layer - slowest, largest */}
      <motion.div
        className="absolute inset-0 gradient-layer-back"
        animate={{
          "--gradient-1": palette.darkMuted || palette.dominant,
          "--gradient-2": palette.darkVibrant || palette.dominant,
          opacity: isActive ? 0.5 : 0.4,
        } as any}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Middle layer - medium */}
      <motion.div
        className="absolute inset-0 gradient-layer-middle"
        animate={{
          "--gradient-1": palette.muted || palette.dominant,
          "--gradient-2": palette.vibrant || palette.dominant,
          opacity: isActive ? 0.7 : 0.6,
        } as any}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Front layer - fastest */}
      <motion.div
        className="absolute inset-0 gradient-layer-front"
        animate={{
          "--gradient-1": palette.lightVibrant || palette.vibrant || palette.dominant,
          "--gradient-2": palette.lightMuted || palette.muted || palette.dominant,
          opacity: isActive ? 0.9 : 0.7,
        } as any}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </div>
  );
}
