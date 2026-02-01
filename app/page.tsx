"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { releases } from "@/lib/releases.generated";
import CoverFlow from "@/components/CoverFlow";
import AnimatedGradient from "@/components/AnimatedGradient";
import ReleaseInfo from "@/components/ReleaseInfo";
import StreamingLinks from "@/components/StreamingLinks";
import SocialFooter from "@/components/SocialFooter";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const prevIndexRef = useRef(0);
  const activeRelease = releases[activeIndex];

  const handleActiveChange = (index: number) => {
    // Determine direction based on index change
    const newDirection = index > prevIndexRef.current ? "right" : "left";
    setDirection(newDirection);
    prevIndexRef.current = index;
    setActiveIndex(index);
  };

  return (
    <main className="fixed inset-0 flex flex-col overflow-hidden bg-black">
      {/* Animated gradient background */}
      <AnimatedGradient palette={activeRelease.palette} />

      {/* Header */}
      <header className="relative z-20 text-center py-4 sm:py-6 no-select">
        <h1 className="flex items-center justify-center">
          <Image
            src="/hunter-harris-signature.svg"
            alt="Hunter Harris"
            width={200}
            height={60}
            className="h-12 sm:h-14 md:h-16 w-auto drop-shadow-lg"
            priority
          />
          <span className="sr-only">Hunter Harris</span>
        </h1>
      </header>

      {/* CoverFlow Carousel */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 min-h-0">
        <CoverFlow
          releases={releases}
          onActiveChange={handleActiveChange}
          initialIndex={0}
        />
      </div>

      {/* Release Info & Streaming Links */}
      <div className="relative z-10 pb-20 sm:pb-24 px-6 flex flex-col items-center gap-3 sm:gap-4">
        <ReleaseInfo release={activeRelease} direction={direction} />
        <StreamingLinks links={activeRelease.streamingLinks} variant="stacked" />
      </div>

      {/* Social Footer */}
      <SocialFooter
        instagram="https://instagram.com/hunterharrismusic"
        tiktok="https://tiktok.com/@hunterharrismusic"
      />
    </main>
  );
}
