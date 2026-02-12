"use client";

import { StreamingLinks as StreamingLinksType } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface StreamingLinksProps {
  links: StreamingLinksType;
  releaseId?: string;
  variant?: "stacked" | "inline";
  desktopAlign?: "center" | "left";
  introDelay?: number; // milliseconds
}

const SpotifyIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="#1DB954"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const AppleMusicIcon = () => (
  <Image
    src="/apple-music-badge.png"
    alt=""
    width={22}
    height={22}
    className="rounded"
  />
);

export default function StreamingLinks({
  links,
  releaseId,
  variant = "stacked",
  desktopAlign = "center",
  introDelay = 0,
}: StreamingLinksProps) {
  // Convert milliseconds to seconds for framer-motion
  const baseDelaySeconds = introDelay / 1000;
  const platforms = [
    {
      name: "Spotify",
      url: links.spotify,
      icon: <SpotifyIcon />,
      label: "Listen on Spotify",
    },
    {
      name: "Apple Music",
      url: links.appleMusic,
      icon: <AppleMusicIcon />,
      label: "Listen on Apple Music",
    },
  ].filter((platform) => platform.url);

  const alignClass = desktopAlign === "left" ? "justify-center lg:justify-start landscape:justify-start" : "justify-center";

  // Show "Coming Soon" badge if no streaming links available
  if (platforms.length === 0) {
    return (
      <AnimatePresence mode="popLayout">
        <motion.div
          key={releaseId || "coming-soon"}
          className={`flex items-center ${alignClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: baseDelaySeconds }}
        >
          <div className="px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-white/60 font-medium text-xs uppercase tracking-widest">
            Coming Soon
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={releaseId || "links"}
        className={`flex ${
          variant === "stacked"
            ? `flex-row gap-3 w-full max-w-[360px] mx-auto lg:mx-0 ${alignClass}`
            : `flex-row gap-4 flex-wrap ${alignClass}`
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: baseDelaySeconds }}
      >
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform.label}
            className="flex-1 flex items-center justify-center gap-2.5 h-[52px] px-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold text-sm shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-150 hover:bg-white/15 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] active:shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <span className="flex-shrink-0">{platform.icon}</span>
            <span>{platform.name}</span>
          </a>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
