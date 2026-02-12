"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { releases } from "@/lib/releases.generated";
import CoverFlow, { type CoverFlowRef, type IntroPhase } from "@/components/CoverFlow";
import AnimatedGradient from "@/components/AnimatedGradient";
import EdgeGradient from "@/components/EdgeGradient";
import ReleaseInfo from "@/components/ReleaseInfo";
import StreamingLinks from "@/components/StreamingLinks";
import SocialFooter from "@/components/SocialFooter";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [introPhase, setIntroPhase] = useState<IntroPhase>('loading');
  const prevIndexRef = useRef(0);
  const coverFlowRef = useRef<CoverFlowRef>(null);
  const activeRelease = useMemo(() => releases[activeIndex], [activeIndex]);

  const handleIntroPhaseChange = useCallback((phase: IntroPhase) => {
    setIntroPhase(phase);
  }, []);

  const handleActiveChange = useCallback((index: number) => {
    // Determine direction based on index change
    setDirection(index > prevIndexRef.current ? "down" : "up");
    prevIndexRef.current = index;
    setActiveIndex(index);
  }, []);

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

  // Forward pan gestures from full-screen overlay to CoverFlow
  const handlePanStart = useCallback(() => {
    coverFlowRef.current?.handlePanStart();
  }, []);

  const handlePan = useCallback((_event: any, info: any) => {
    coverFlowRef.current?.handlePan(_event, info);
  }, []);

  const handlePanEnd = useCallback((_event: any, info: any) => {
    coverFlowRef.current?.handlePanEnd(_event, info);
  }, []);

  return (
    <main
      className="fixed inset-0"
      style={{ touchAction: 'none' }}
      onClick={handleScreenTap}
    >
      {/* Animated gradient background - extends beyond viewport for iOS and Safari chrome */}
      <div className="fixed z-0" style={{ top: '-200px', left: 0, right: 0, bottom: '-200px' }}>
        <AnimatedGradient palette={activeRelease.palette} introPhase={introPhase} />
      </div>

      {/* Dynamic edge gradients for text legibility */}
      <EdgeGradient position="top" palette={activeRelease.palette} />
      <EdgeGradient position="bottom" palette={activeRelease.palette} />

      {/* Full-screen gesture capture layer - captures pan/swipe from anywhere on screen */}
      <motion.div
        className="fixed inset-0 z-30"
        style={{ touchAction: 'none' }}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
      />

      {/* Header - fixed position, content respects safe area */}
      <header className="fixed top-0 left-0 right-0 z-20 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] sm:pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-3 sm:pb-4 no-select pointer-events-none">
        <motion.div
          className="flex items-center justify-center lg:justify-start lg:px-8 landscape:justify-start landscape:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: introPhase === 'loading' ? 0 : 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          <h1 className="flex items-center pointer-events-auto">
            <Image
              src="/hunter-harris-signature.png"
              alt="Hunter Harris"
              width={254}
              height={120}
              className="h-10 sm:h-12 md:h-14 w-auto drop-shadow-lg"
            />
            <span className="sr-only">Hunter Harris</span>
          </h1>
        </motion.div>
      </header>

      {/* CoverFlow section - below edge gradients so blur works on artwork */}
      <div className="fixed inset-0 z-10 flex items-center justify-center px-4 pt-24 pb-[45vh]
        lg:pt-0 lg:pb-0 lg:pr-[45%] lg:pl-8
        landscape:pt-0 landscape:pb-0 landscape:pr-[45%] landscape:pl-6 pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <div
          className="flex items-center justify-center h-[min(55vh,480px)]
            lg:h-[min(75vh,700px)] lg:w-full lg:justify-end
            landscape:h-[min(80vh,400px)] landscape:w-full landscape:justify-end"
          style={{ overflow: 'visible' }}
        >
          <CoverFlow
            ref={coverFlowRef}
            releases={releases}
            onActiveChange={handleActiveChange}
            onIntroPhaseChange={handleIntroPhaseChange}
            initialIndex={0}
          />
        </div>
      </div>

      {/* Release Info section - pointer-events-none so gestures pass through, links remain clickable */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pointer-events-none
          lg:inset-0 lg:items-center lg:justify-center lg:pl-[55%] lg:pr-8 lg:pb-0
          landscape:inset-0 landscape:items-center landscape:justify-center landscape:pl-[55%] landscape:pr-6 landscape:pb-0"
      >
        <div className="flex flex-col items-center gap-2 w-full max-w-sm lg:items-start lg:max-w-md lg:gap-4 landscape:items-start landscape:max-w-sm landscape:gap-3">
          <ReleaseInfo release={activeRelease} direction={direction} desktopAlign="left" introDelay={introPhase === 'loading' ? 2000 : 0} />
          <div className="relative z-40 pointer-events-auto w-full">
            <StreamingLinks links={activeRelease.streamingLinks} releaseId={activeRelease.id} variant="stacked" desktopAlign="left" introDelay={introPhase === 'loading' ? 2200 : 0} />
          </div>
        </div>
      </div>

      {/* Social Footer - bottom on mobile, top-right on desktop */}
      <SocialFooter
        instagram="https://instagram.com/hunterharrismusic"
        tiktok="https://www.tiktok.com/@hunter.harris.period"
        x="https://x.com/hunterharrismus"
      />
    </main>
  );
}
