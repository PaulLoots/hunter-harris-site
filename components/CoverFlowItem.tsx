"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import type { Release } from "@/lib/types";

interface CoverFlowItemProps {
  release: Release;
  index: number;
  activeIndex: number;
  continuousPosition: MotionValue<number>;
  hasEntered: boolean;
  isDragging: boolean;
  onClick: () => void;
}

export default function CoverFlowItem({
  release,
  index,
  activeIndex,
  continuousPosition,
  hasEntered,
  isDragging,
  onClick,
}: CoverFlowItemProps) {
  // Calculate continuous offset from current position (real-time during drag)
  const continuousOffset = useTransform(continuousPosition, (pos) => index - pos);

  // No blur - keep all items sharp and visible
  const blurFilter = "blur(0px)";

  // Calculate transform based on continuous offset for real-time tracking
  // Vertical CoverFlow: items stack behind active item with rotateX tilt
  // IMPORTANT: All values must be fully continuous (no jumps at boundaries)
  // to prevent visual popping during mid-scroll transitions
  const transform = useTransform(continuousOffset, (offset) => {
    const absOffset = Math.abs(offset);
    const sign = offset < 0 ? -1 : 1;

    // Vertical spacing - continuous curve with no jumps
    // offset 0→0%, 1→58%, 2→95%, 3→120%, 4+→+25% each
    let translateY = 0;
    if (absOffset <= 1) {
      translateY = absOffset * 58;
    } else if (absOffset <= 2) {
      translateY = 58 + (absOffset - 1) * 37;
    } else {
      translateY = 95 + (absOffset - 2) * 25;
    }
    translateY = translateY * sign;

    // Z translation - continuous interpolation, shallow depth
    // offset 0→0, 1→-80, 2→-120, 3+→-160
    let translateZ = 0;
    if (absOffset <= 1) {
      translateZ = absOffset * -80;
    } else if (absOffset <= 2) {
      translateZ = -80 + (absOffset - 1) * -40;
    } else if (absOffset <= 3) {
      translateZ = -120 + (absOffset - 2) * -40;
    } else {
      translateZ = -160;
    }

    // rotateX - front-loaded curve so items tilt away quickly
    // Continuous: offset 0→0°, 0.5→60°, 1→65°, 2→72°, 3+→75°
    let rotateX = 0;
    if (absOffset <= 0.5) {
      rotateX = absOffset * 120;
    } else if (absOffset <= 1) {
      rotateX = 60 + (absOffset - 0.5) * 10;
    } else if (absOffset <= 2) {
      rotateX = 65 + (absOffset - 1) * 7;
    } else {
      rotateX = Math.min(75, 72 + (absOffset - 2) * 3);
    }
    rotateX = rotateX * (offset < 0 ? -1 : 1);

    // Scale - continuous: offset 0→1.0, 1→0.92, 2→0.87, 3+→0.85
    let scale = 1;
    if (absOffset <= 1) {
      scale = 1 - absOffset * 0.08;
    } else if (absOffset <= 2) {
      scale = 0.92 - (absOffset - 1) * 0.05;
    } else {
      scale = Math.max(0.85, 0.87 - (absOffset - 2) * 0.02);
    }

    return `translateY(${translateY}%) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
  });

  // Keep all items fully visible - no opacity fade
  const opacity = 1;

  const isActive = index === activeIndex;

  // Entry variants for "deal in" animation on page load
  const entryVariants = {
    hidden: {
      opacity: 0,
      transform: "translateY(120%) translateZ(-200px) rotateX(-60deg) scale(0.5)",
    },
    visible: {
      opacity: 1,
      transform: "translateY(0%) translateZ(0px) rotateX(0deg) scale(1)",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: index * 0.08,  // Stagger: 80ms between items
      },
    },
  };

  return (
    <>
      {/* Main artwork card */}
      <motion.div
        className="absolute cursor-pointer will-change-transform no-select"
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transform: hasEntered ? transform : undefined,
          opacity: hasEntered ? opacity : undefined,
          filter: hasEntered ? blurFilter : undefined,
        }}
        initial={hasEntered ? false : "hidden"}
        animate={hasEntered ? false : "visible"}
        variants={hasEntered ? undefined : entryVariants}
        onClick={onClick}
        aria-current={isActive ? "true" : "false"}
      >
        <div className="relative w-[85vw] max-w-[480px] md:w-[50vw] md:max-w-[520px] aspect-square">
          <Image
            src={release.artworkPath}
            alt={`${release.title} artwork`}
            fill
            sizes="(max-width: 768px) 85vw, 50vw"
            className="rounded-xl shadow-2xl object-cover no-drag pointer-events-none"
            loading={Math.abs(index - activeIndex) <= 6 ? "eager" : "lazy"}
            priority={index === 0}
            draggable={false}
          />
        </div>
      </motion.div>
    </>
  );
}
