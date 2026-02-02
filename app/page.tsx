"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { releases } from "@/lib/releases.generated";
import CoverFlow, { type CoverFlowRef } from "@/components/CoverFlow";
import AnimatedGradient from "@/components/AnimatedGradient";
import ReleaseInfo from "@/components/ReleaseInfo";
import StreamingLinks from "@/components/StreamingLinks";
import SocialFooter from "@/components/SocialFooter";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const prevIndexRef = useRef(0);
  const coverFlowRef = useRef<CoverFlowRef>(null);
  const activeRelease = releases[activeIndex];

  const handleActiveChange = (index: number) => {
    // Determine direction based on index change
    const newDirection = index > prevIndexRef.current ? "down" : "up";
    setDirection(newDirection);
    prevIndexRef.current = index;
    setActiveIndex(index);
  };

  const handleScreenTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only handle taps on the background, not on interactive elements
    if ((e.target as HTMLElement).closest('a, button, [role="region"]')) {
      return;
    }

    const screenHeight = window.innerHeight;
    const tapY = e.clientY;
    const tapZone = screenHeight * 0.25; // 25% of screen height on top/bottom

    if (tapY < tapZone) {
      // Tapped on top - go to previous
      if (coverFlowRef.current) {
        coverFlowRef.current.navigateToIndex(activeIndex - 1);
      }
    } else if (tapY > screenHeight - tapZone) {
      // Tapped on bottom - go to next
      if (coverFlowRef.current) {
        coverFlowRef.current.navigateToIndex(activeIndex + 1);
      }
    }
  };

  return (
    <main
      className="fixed inset-0"
      style={{ overflow: 'hidden', touchAction: 'none' }}
      onClick={handleScreenTap}
    >
      {/* Animated gradient background - extends beyond viewport for iOS and Safari chrome */}
      <div className="fixed z-0" style={{ top: '-200px', left: 0, right: 0, bottom: '-200px' }}>
        <AnimatedGradient palette={activeRelease.palette} />
      </div>

      {/* Header - fixed position */}
      <header className="fixed top-0 left-0 right-0 z-20 text-center py-3 sm:py-4 no-select pointer-events-none">
        <h1 className="flex items-center justify-center pointer-events-auto">
          <Image
            src="/hunter-harris-signature.svg"
            alt="Hunter Harris"
            width={200}
            height={60}
            className="h-10 sm:h-12 md:h-14 w-auto drop-shadow-lg"
            priority
          />
          <span className="sr-only">Hunter Harris</span>
        </h1>
      </header>

      {/* CoverFlow Carousel - Fixed position and height to prevent jumping */}
      <div
        className="fixed left-0 right-0 z-10 flex items-center justify-center px-4"
        style={{
          top: 'calc(3rem + 12px)',
          height: 'min(55vh, 480px)',
          overflow: 'visible'
        }}
      >
        <CoverFlow
          ref={coverFlowRef}
          releases={releases}
          onActiveChange={handleActiveChange}
          initialIndex={0}
        />
      </div>

      {/* Release Info & Streaming Links - Absolutely positioned with fixed dimensions */}
      <div
        className="fixed left-0 right-0 z-10 flex flex-col items-center px-6 pointer-events-none"
        style={{
          top: 'calc(3rem + 12px + min(55vh, 480px) + 1.5rem)',
          bottom: 'calc(3rem + env(safe-area-inset-bottom))',
          minHeight: '240px'
        }}
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4 pointer-events-auto w-full max-w-sm">
          <ReleaseInfo release={activeRelease} direction={direction} />
          <StreamingLinks links={activeRelease.streamingLinks} variant="stacked" />
        </div>
      </div>

      {/* Social Footer */}
      <SocialFooter
        instagram="https://instagram.com/hunterharrismusic"
        tiktok="https://tiktok.com/@hunterharrismusic"
      />
    </main>
  );
}
