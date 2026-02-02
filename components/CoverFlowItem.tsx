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
  // Vertical CoverFlow: items above/below center with rotateX for depth
  const transform = useTransform(continuousOffset, (offset) => {
    const absOffset = Math.abs(offset);

    // Progressive vertical spacing - wider for center items, tighter for periphery
    let translateY = 0;
    if (absOffset <= 2) {
      translateY = offset * 45;
    } else {
      translateY = offset * 28;
    }

    // Progressive Z translation - items stack deeper as they go back
    let translateZ = 0;
    if (absOffset <= 1) {
      translateZ = absOffset * -180;
    } else if (absOffset <= 2) {
      translateZ = -180 + (absOffset - 1) * -140;
    } else {
      translateZ = -400;
    }

    // Progressive rotateX - items tilt as they go back
    // Items above (offset < 0): tilt backward (+rotateX)
    // Items below (offset > 0): tilt forward (-rotateX)
    let rotateX = 0;
    if (absOffset <= 1) {
      rotateX = absOffset * 55;
    } else if (absOffset <= 2) {
      rotateX = 55 + (absOffset - 1) * 25;
    } else {
      rotateX = 85;
    }
    rotateX = rotateX * (offset < 0 ? -1 : 1);

    // Progressive scale
    let scale = 1;
    if (absOffset <= 1) {
      scale = 1 - absOffset * 0.1;
    } else if (absOffset <= 2) {
      scale = 0.9 - (absOffset - 1) * 0.08;
    } else {
      scale = 0.75;
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
