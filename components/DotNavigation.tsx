"use client";

import { motion } from "framer-motion";

interface DotNavigationProps {
  totalSections: number;
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export default function DotNavigation({
  totalSections,
  activeIndex,
  onNavigate,
}: DotNavigationProps) {
  return (
    <nav
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4"
      aria-label="Section navigation"
    >
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => onNavigate(index)}
          aria-label={`Go to section ${index + 1}`}
          aria-current={activeIndex === index ? "true" : "false"}
          className="group relative focus:outline-none"
        >
          <motion.div
            className="bg-white/40 group-hover:bg-white/60 transition-colors duration-300"
            initial={false}
            animate={{
              width: activeIndex === index ? 24 : 8,
              height: 8,
              opacity: activeIndex === index ? 1 : 0.4,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              borderRadius: 4,
            }}
          />
          {/* Larger touch target for mobile */}
          <span className="absolute inset-0 -m-2" />
        </button>
      ))}
    </nav>
  );
}
