"use client";

import { useState, useEffect, useCallback } from "react";
import { releases } from "@/lib/releases";
import ReleaseSection from "@/components/ReleaseSection";
import DotNavigation from "@/components/DotNavigation";
import SocialFooter from "@/components/SocialFooter";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToSection = useCallback((index: number) => {
    const section = document.getElementById(`release-${index}`);
    section?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(
            entry.target.id.replace("release-", ""),
            10
          );
          setActiveIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    releases.forEach((_, index) => {
      const section = document.getElementById(`release-${index}`);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="relative">
      {/* Snap scroll container */}
      <div className="h-screen overflow-y-auto snap-y snap-mandatory">
        {releases.map((release, index) => (
          <ReleaseSection
            key={release.id}
            release={release}
            index={index}
            isActive={activeIndex === index}
          />
        ))}
      </div>

      {/* Fixed elements */}
      <DotNavigation
        totalSections={releases.length}
        activeIndex={activeIndex}
        onNavigate={scrollToSection}
      />

      <SocialFooter
        instagram="https://instagram.com/hunterharrismusic"
        tiktok="https://tiktok.com/@hunterharrismusic"
      />
    </main>
  );
}
