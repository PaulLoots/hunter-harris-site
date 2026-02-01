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
  // Use smooth interpolation with progressive stacking for CoverFlow effect
  const transform = useTransform(continuousOffset, (offset) => {
    const absOffset = Math.abs(offset);

    // Progressive horizontal spacing - wider for center items, tighter for periphery
    // offset ±1, ±2: 45% (original spacing), offset ±3+: 28% (tighter stacking)
    let translateX = 0;
    if (absOffset <= 2) {
      translateX = offset * 45;  // Center items: comfortable spacing
    } else {
      translateX = offset * 28;  // Peripheral items: tight stacking
    }

    // Progressive Z translation - items stack deeper as they go back
    // offset 0: 0px, offset 1: -180px, offset 2: -320px, offset 3+: -400px
    let translateZ = 0;
    if (absOffset <= 1) {
      translateZ = absOffset * -180;
    } else if (absOffset <= 2) {
      translateZ = -180 + (absOffset - 1) * -140;
    } else {
      translateZ = -400;
    }

    // Progressive rotation - items rotate more as they go back
    // offset 0: 0deg, offset 1: 55deg, offset 2: 80deg, offset 3+: 85deg
    let rotateY = 0;
    if (absOffset <= 1) {
      rotateY = absOffset * 55;
    } else if (absOffset <= 2) {
      rotateY = 55 + (absOffset - 1) * 25;
    } else {
      rotateY = 85;
    }
    rotateY = rotateY * (offset < 0 ? 1 : -1);

    // Progressive scale - keep items larger for tight CoverFlow look
    // offset 0: 1.0, offset 1: 0.9, offset 2: 0.82, offset 3+: 0.75
    let scale = 1;
    if (absOffset <= 1) {
      scale = 1 - absOffset * 0.1;
    } else if (absOffset <= 2) {
      scale = 0.9 - (absOffset - 1) * 0.08;
    } else {
      scale = 0.75;
    }

    return `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
  });

  // Keep all items fully visible - no opacity fade
  const opacity = 1;

  const isActive = index === activeIndex;

  // Entry variants for "deal in" animation on page load
  const entryVariants = {
    hidden: {
      opacity: 0,
      transform: "translateX(120%) translateZ(-200px) rotateY(60deg) scale(0.5)",
    },
    visible: {
      opacity: 1,
      transform: "translateX(0%) translateZ(0px) rotateY(0deg) scale(1)",
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
        <div className="relative w-[60vw] max-w-[320px] md:w-[40vw] md:max-w-[400px] aspect-square">
          <Image
            src={release.artworkPath}
            alt={`${release.title} artwork`}
            fill
            sizes="(max-width: 768px) 60vw, 40vw"
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
