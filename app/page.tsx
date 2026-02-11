"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { releases } from "@/lib/releases.generated";
import CoverFlow, { type CoverFlowRef, type IntroPhase } from "@/components/CoverFlow";
import AnimatedGradient from "@/components/AnimatedGradient";
import ReleaseInfo from "@/components/ReleaseInfo";
import StreamingLinks from "@/components/StreamingLinks";
import SocialFooter from "@/components/SocialFooter";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [introPhase, setIntroPhase] = useState<IntroPhase>('loading');
  const prevIndexRef = useRef(0);
  const coverFlowRef = useRef<CoverFlowRef>(null);
  const activeRelease = releases[activeIndex];

  const handleIntroPhaseChange = useCallback((phase: IntroPhase) => {
    setIntroPhase(phase);
  }, []);

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
        <AnimatedGradient palette={activeRelease.palette} introPhase={introPhase} />
      </div>

      {/* Header - fixed position */}
      <header className="fixed top-0 left-0 right-0 z-20 py-3 sm:py-4 no-select pointer-events-none">
        <motion.div
          className="flex items-center justify-center lg:justify-start lg:px-8 landscape:justify-start landscape:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: introPhase === 'loading' ? 0 : 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          <h1 className="flex items-center pointer-events-auto">
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
        </motion.div>
      </header>

      {/* Main content wrapper - switches from stacked to side-by-side at lg or landscape */}
      <div className="fixed inset-0 z-10 flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-16 xl:gap-24 lg:px-8 landscape:flex-row landscape:items-center landscape:justify-center landscape:gap-12 landscape:px-6">

        {/* CoverFlow section */}
        <div
          className="flex items-center justify-center px-4 mt-16 h-[min(55vh,480px)]
            lg:flex-none lg:w-[50%] lg:justify-end lg:px-0 lg:mt-0 lg:h-[min(70vh,600px)]
            landscape:flex-none landscape:w-[50%] landscape:justify-end landscape:px-0 landscape:mt-0 landscape:h-[min(80vh,400px)]"
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

        {/* Spacer for mobile portrait - pushes content down */}
        <div className="flex-1 lg:hidden landscape:hidden" />

        {/* Release Info section */}
        <div
          className="flex flex-col items-center px-6 z-20 pb-[calc(2.5rem+env(safe-area-inset-bottom))]
            lg:flex-none lg:items-start lg:w-[40%] lg:max-w-md lg:px-0 lg:pb-0
            landscape:flex-none landscape:items-start landscape:w-[40%] landscape:max-w-sm landscape:px-0 landscape:pb-0"
        >
          <div className="flex flex-col items-center gap-2 w-full max-w-sm lg:items-start lg:max-w-none lg:gap-4 landscape:items-start landscape:max-w-none landscape:gap-3">
            <ReleaseInfo release={activeRelease} direction={direction} desktopAlign="left" introDelay={introPhase === 'loading' ? 2000 : 0} />
            <StreamingLinks links={activeRelease.streamingLinks} variant="stacked" desktopAlign="left" introDelay={introPhase === 'loading' ? 2200 : 0} />
          </div>
        </div>
      </div>

      {/* Bottom fade gradient (mobile portrait only) */}
      <div
        className="fixed left-0 right-0 bottom-0 pointer-events-none lg:hidden landscape:hidden"
        style={{
          zIndex: 5,
          top: '50%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Social Footer - bottom on mobile, top-right on desktop */}
      <SocialFooter
        instagram="https://instagram.com/hunterharrismusic"
        tiktok="https://tiktok.com/@hunterharrismusic"
      />
    </main>
  );
}
