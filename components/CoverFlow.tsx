"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import type { Release } from "@/lib/types";
import CoverFlowItem from "./CoverFlowItem";

export type IntroPhase = 'loading' | 'background' | 'fanout' | 'complete';

interface CoverFlowProps {
  releases: Release[];
  onActiveChange: (index: number) => void;
  onIntroPhaseChange?: (phase: IntroPhase) => void;
  initialIndex?: number;
}

export interface CoverFlowRef {
  navigateToIndex: (index: number) => void;
}

const CoverFlow = forwardRef<CoverFlowRef, CoverFlowProps>(({
  releases,
  onActiveChange,
  onIntroPhaseChange,
  initialIndex = 0,
}, ref) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [introPhase, setIntroPhase] = useState<IntroPhase>('loading');
  const [isDragging, setIsDragging] = useState(false);
  const xPosition = useMotionValue(initialIndex);
  const dragStartPosition = useMotionValue(initialIndex);

  // Helper function to normalize index with modulo for infinite scrolling
  const normalizeIndex = useCallback((index: number) => {
    const normalized = index % releases.length;
    return normalized < 0 ? normalized + releases.length : normalized;
  }, [releases.length]);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Intro animation phases
  useEffect(() => {
    // If reduced motion, skip to complete immediately
    if (prefersReducedMotion) {
      setIntroPhase('complete');
      onIntroPhaseChange?.('complete');
      return;
    }

    // Phase 1: Background fade + stack reveal starts (100ms delay to ensure mount)
    const bgTimer = setTimeout(() => {
      setIntroPhase('background');
      onIntroPhaseChange?.('background');
    }, 100);

    // Phase 2: Fan out starts (900ms - after stack has scaled up and settled)
    const fanTimer = setTimeout(() => {
      setIntroPhase('fanout');
      onIntroPhaseChange?.('fanout');
    }, 900);

    // Phase 3: Complete (2500ms - after fan out animation finishes)
    const completeTimer = setTimeout(() => {
      setIntroPhase('complete');
      onIntroPhaseChange?.('complete');
    }, 2500);

    return () => {
      clearTimeout(bgTimer);
      clearTimeout(fanTimer);
      clearTimeout(completeTimer);
    };
  }, [prefersReducedMotion, onIntroPhaseChange]);

  // Update active index and notify parent
  const updateActiveIndex = useCallback(
    (newIndex: number) => {
      const normalized = normalizeIndex(newIndex);
      setActiveIndex(normalized);
      onActiveChange(normalized);
    },
    [onActiveChange, normalizeIndex]
  );

  // Navigate to specific index
  const navigateToIndex = useCallback(
    (targetIndex: number) => {
      if (isDragging) return; // Don't navigate while dragging
      if (introPhase !== 'complete') return; // Don't navigate during intro

      // Smoother spring animation
      animate(xPosition, targetIndex, {
        type: "spring",
        stiffness: 200,
        damping: 30,
        mass: 1.0,
        onUpdate: (latest) => {
          const snappedIndex = Math.round(latest);
          if (normalizeIndex(snappedIndex) !== activeIndex) {
            updateActiveIndex(snappedIndex);
          }
        },
        onComplete: () => {
          xPosition.set(targetIndex);
          updateActiveIndex(targetIndex);
        },
      });
    },
    [isDragging, introPhase, updateActiveIndex, xPosition, activeIndex, normalizeIndex]
  );

  // Expose navigateToIndex to parent via ref
  useImperativeHandle(ref, () => ({
    navigateToIndex,
  }), [navigateToIndex]);

  // Calculate target based on velocity for momentum
  const calculateMomentumTarget = useCallback(
    (velocity: number, currentIndex: number) => {
      // Very high thresholds to reduce sensitivity
      const velocityFactor = Math.abs(velocity) / 1800; // Increased from 1200

      let itemCount = 0;
      if (velocityFactor < 1) itemCount = 1;      // Gentle: 1 item
      else if (velocityFactor < 3) itemCount = 2;  // Medium: 2 items
      else if (velocityFactor < 6) itemCount = 3;  // Fast: 3 items
      else itemCount = Math.min(4, Math.ceil(velocityFactor * 0.5)); // Very fast: max 4

      const direction = velocity < 0 ? 1 : -1;
      const targetIndex = currentIndex + (itemCount * direction);

      return targetIndex; // No clamping for infinite scroll
    },
    []
  );

  // Handle pan start - stop any running animation
  const handlePanStart = useCallback(() => {
    if (introPhase !== 'complete') return; // Don't allow dragging during intro
    setIsDragging(true);
    // Stop any running spring animation immediately
    xPosition.stop();
    // Snap to nearest integer to prevent drift
    const current = Math.round(xPosition.get());
    xPosition.set(current);
    // Capture starting position for this drag
    dragStartPosition.set(current);
  }, [xPosition, dragStartPosition, introPhase]);

  // Handle pan - real-time 1:1 tracking
  const handlePan = useCallback(
    (_event: any, info: any) => {
      if (!isDragging) return;

      // Calculate position based on drag offset from start position
      // Negative offset.y = swipe up = increase index (next item)
      // Mobile-optimized sensitivity: 150px to move one item (very responsive)
      const dragProgress = -info.offset.y / 150;
      const startPos = dragStartPosition.get();
      const newPosition = startPos + dragProgress;

      // Update position in real-time (no clamping for infinite scroll)
      xPosition.set(newPosition);

      // Update active index as user drags past items
      const snappedIndex = Math.round(newPosition);
      if (normalizeIndex(snappedIndex) !== activeIndex) {
        updateActiveIndex(snappedIndex);
      }
    },
    [isDragging, activeIndex, xPosition, dragStartPosition, updateActiveIndex, normalizeIndex]
  );

  // Handle pan end with momentum
  const handlePanEnd = useCallback(
    (_event: any, info: any) => {
      setIsDragging(false);

      const currentPosition = xPosition.get();
      const startPos = dragStartPosition.get();
      const dragDistance = Math.abs(currentPosition - startPos);

      let targetIndex;

      // If drag distance is small (< 0.4 items) OR velocity is low, just snap to nearest
      // This prevents accidental flicks when user just taps or barely moves
      if (dragDistance < 0.4 || Math.abs(info.velocity.y) < 800) {
        targetIndex = Math.round(currentPosition);
      } else {
        // Use momentum for larger, faster drags
        targetIndex = calculateMomentumTarget(info.velocity.y, Math.round(currentPosition));
      }

      // No clamping for infinite scroll

      // Smoother spring with less bounce
      animate(xPosition, targetIndex, {
        type: "spring",
        stiffness: 250,
        damping: 28,
        mass: 0.8,
        velocity: info.velocity.y / 150,
        onUpdate: (latest) => {
          const snappedIndex = Math.round(latest);
          if (normalizeIndex(snappedIndex) !== activeIndex) {
            updateActiveIndex(snappedIndex);
          }
        },
        onComplete: () => {
          // Ensure final position is exact
          xPosition.set(targetIndex);
          updateActiveIndex(targetIndex);
        },
      });
    },
    [activeIndex, xPosition, dragStartPosition, calculateMomentumTarget, updateActiveIndex, normalizeIndex]
  );

  // Keyboard navigation (up/down arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (introPhase !== 'complete') return; // Don't navigate during intro
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const currentPos = Math.round(xPosition.get());
        navigateToIndex(currentPos - 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const currentPos = Math.round(xPosition.get());
        navigateToIndex(currentPos + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateToIndex, xPosition, introPhase]);

  // Scroll wheel navigation
  useEffect(() => {
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;
    let accumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      if (introPhase !== 'complete') return; // Don't navigate during intro
      e.preventDefault();

      accumulatedDelta += e.deltaY;

      if (wheelTimeout) clearTimeout(wheelTimeout);

      wheelTimeout = setTimeout(() => {
        // ~120px of wheel delta = 1 item (standard mouse wheel notch)
        const items = Math.max(-4, Math.min(4, Math.round(accumulatedDelta / 120)));
        if (items !== 0) {
          const currentPos = Math.round(xPosition.get());
          navigateToIndex(currentPos + items);
        }
        accumulatedDelta = 0;
      }, 50);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [navigateToIndex, xPosition, introPhase]);

  // Generate visible items for infinite scrolling
  // Render items in a window around current position
  const visibleItems = useMemo(() => {
    const items = [];
    const currentPos = Math.round(xPosition.get());
    const range = 12; // Render ±12 items from current position for better coverage

    for (let i = -range; i <= range; i++) {
      const position = currentPos + i;
      const releaseIndex = normalizeIndex(position);
      const release = releases[releaseIndex];

      items.push({
        position,
        release,
        releaseIndex,
      });
    }

    return items;
  }, [releases, normalizeIndex, activeIndex]); // Re-compute when activeIndex changes

  return (
    <motion.div
      className="perspective-container relative w-full h-full"
      style={{ overflow: 'visible' }}
      role="region"
      aria-label="Music releases carousel"
      onPanStart={handlePanStart}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
    >
      <div className="preserve-3d flex items-center justify-center h-full relative" style={{ overflow: 'visible' }}>
        {visibleItems.map((item) => (
          <CoverFlowItem
            key={`${item.releaseIndex}-${Math.floor(item.position / releases.length)}`}
            release={item.release}
            index={item.position}
            activeIndex={activeIndex}
            continuousPosition={xPosition}
            introPhase={introPhase}
            isDragging={isDragging}
            onClick={() => navigateToIndex(item.position)}
          />
        ))}
      </div>
    </motion.div>
  );
});

CoverFlow.displayName = "CoverFlow";

export default CoverFlow;
