"use client";

import { ColorPalette } from "@/lib/types";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface AnimatedGradientProps {
  palette: ColorPalette;
  isActive?: boolean;
}

export default function AnimatedGradient({
  palette,
  isActive = true,
}: AnimatedGradientProps) {
  const gradientStyle = useMemo(
    () => ({
      "--gradient-1": palette.vibrant,
      "--gradient-2": palette.darkMuted,
      "--gradient-3": palette.lightVibrant,
      "--gradient-base": palette.darkVibrant,
    }),
    [palette]
  );

  return (
    <motion.div
      className="animated-gradient absolute inset-0 -z-10"
      style={gradientStyle as React.CSSProperties}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.7 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  );
}
