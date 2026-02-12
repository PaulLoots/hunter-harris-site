"use client";

import { motion, useTransform, useMotionValue, animate, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useMemo, useEffect, memo } from "react";
import type { Release } from "@/lib/types";
import type { IntroPhase } from "./CoverFlow";

interface CoverFlowItemProps {
  release: Release;
  index: number;
  activeIndex: number;
  continuousPosition: MotionValue<number>;
  introPhase: IntroPhase;
  isDragging: boolean;
  onClick: () => void;
}

// Helper to calculate fanned transform components (returns object, not string)
function calculateFannedComponents(offset: number) {
  const absOffset = Math.abs(offset);
  const sign = offset < 0 ? -1 : 1;

  // Vertical spacing
  let translateY = 0;
  if (absOffset <= 1) {
    translateY = absOffset * 58;
  } else if (absOffset <= 2) {
    translateY = 58 + (absOffset - 1) * 37;
  } else {
    translateY = 95 + (absOffset - 2) * 25;
  }
  translateY = translateY * sign;

  // Z translation
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

  // rotateX
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

  // Scale
  let scale = 1;
  if (absOffset <= 1) {
    scale = 1 - absOffset * 0.08;
  } else if (absOffset <= 2) {
    scale = 0.92 - (absOffset - 1) * 0.05;
  } else {
    scale = Math.max(0.85, 0.87 - (absOffset - 2) * 0.02);
  }

  return { translateY, translateZ, rotateX, scale };
}

export default memo(function CoverFlowItem({
  release,
  index,
  activeIndex,
  continuousPosition,
  introPhase,
  isDragging,
  onClick,
}: CoverFlowItemProps) {
  // Fan progress: 0 = stacked, 1 = fanned
  // IMPORTANT: Start at 1 if intro is already complete (for items added during scrolling)
  const fanProgress = useMotionValue(introPhase === 'complete' ? 1 : 0);

  // Stack scale: starts at 0.85, animates to 1.0 during background phase
  const stackScale = useMotionValue(introPhase === 'complete' ? 1 : 0.85);

  // Generate a stable random rotation for stacked state (-2 to +2 degrees, subtler)
  const stackedRotation = useMemo(() => {
    const seed = index * 137.5;
    return ((seed % 4) - 2);
  }, [index]);

  // Stacked Z position - active item on top, others behind based on distance
  // Large separation prevents intersection during fan-out rotation
  const stackedZ = useMemo(() => {
    const distance = Math.abs(index - activeIndex);
    return -distance * 8;  // Active = 0 (front), others well behind (-8, -16, -24, etc.)
  }, [index, activeIndex]);

  // Calculate stagger delay based on distance from center (longer for dramatic cascade)
  const staggerDelay = useMemo(() => {
    const distanceFromCenter = Math.abs(index - activeIndex);
    // 80ms per step, max 400ms for more dramatic cascade
    return Math.min(distanceFromCenter * 0.08, 0.4);
  }, [index, activeIndex]);

  // Animate stack scale when background phase starts (smooth ease-in-out)
  useEffect(() => {
    if (introPhase === 'background') {
      animate(stackScale, 1, {
        type: "tween",
        duration: 0.7,
        ease: "easeInOut",
      });
    } else if (introPhase === 'loading') {
      stackScale.set(0.85);
    }
  }, [introPhase, stackScale]);

  // Animate fanProgress when fanout starts (slower, more dramatic)
  useEffect(() => {
    if (introPhase === 'fanout' || introPhase === 'complete') {
      animate(fanProgress, 1, {
        type: "spring",
        stiffness: 100,     // Balanced (not too fast, not too laggy)
        damping: 22,        // Smooth settling
        mass: 1.0,          // Natural weight
        delay: introPhase === 'fanout' ? staggerDelay : 0,
      });
    } else {
      // Reset to stacked if going back to loading/background
      fanProgress.set(0);
    }
  }, [introPhase, fanProgress, staggerDelay]);

  // Calculate continuous offset from current position
  const continuousOffset = useTransform(continuousPosition, (pos) => index - pos);

  // Blended transform: interpolates between stacked and fanned based on fanProgress
  const transform = useTransform(
    [fanProgress, continuousOffset, stackScale],
    ([progress, offset, sScale]: number[]) => {
      // Calculate fanned values based on current offset
      const fanned = calculateFannedComponents(offset);

      // When stacked (progress < 1), use stackScale; when fanned, use fanned scale
      const baseStackScale = progress < 1 ? sScale : 1;

      // Interpolate between stacked (progress=0) and fanned (progress=1)
      // Z leads rotation by 50% to prevent items cutting through each other
      const zProgress = Math.min(1, progress * 1.5);
      const translateY = fanned.translateY * progress;
      const translateZ = stackedZ + (fanned.translateZ - stackedZ) * zProgress;
      const rotateX = fanned.rotateX * progress;
      const rotateZ = stackedRotation * (1 - progress); // Fade out random rotation

      // Scale: blend from stackScale to fanned scale
      const scale = baseStackScale + (fanned.scale - baseStackScale) * progress;

      return `translateY(${translateY}%) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
    }
  );

  const isActive = index === activeIndex;

  // Progressive shadows: none → very subtle → full
  let shadowClass = "shadow-2xl"; // complete phase
  if (introPhase === 'loading' || introPhase === 'background') {
    shadowClass = "shadow-none";
  } else if (introPhase === 'fanout') {
    shadowClass = "shadow-sm"; // barely visible during animation
  }

  // Instant opacity - all items appear together (no staggered fade)
  const itemOpacity = introPhase === 'loading' ? 0 : 1;

  return (
    <motion.div
      className="absolute cursor-pointer will-change-transform no-select"
      style={{
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        transform, // Always use the blended motion value
        opacity: itemOpacity,
      }}
      onClick={onClick}
      aria-current={isActive ? "true" : "false"}
    >
      <div className="relative w-[85vw] max-w-[480px] md:w-[50vw] md:max-w-[520px] lg:w-[38vw] lg:max-w-[620px] xl:max-w-[680px] landscape:w-[50vh] landscape:max-w-[380px] aspect-square">
        <Image
          src={release.artworkPath}
          alt={`${release.title} artwork`}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 38vw"
          className={`rounded-xl ${shadowClass} object-cover no-drag pointer-events-none`}
          loading={Math.abs(index - activeIndex) <= 6 ? "eager" : "lazy"}
          priority={Math.abs(index - activeIndex) <= 2}
          draggable={false}
        />
      </div>
    </motion.div>
  );
})
