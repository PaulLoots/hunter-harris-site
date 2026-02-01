"use client";

import { StreamingLinks as StreamingLinksType } from "@/lib/types";
import { motion } from "framer-motion";

interface StreamingLinksProps {
  links: StreamingLinksType;
  variant?: "stacked" | "inline";
}

const SpotifyIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const AppleMusicIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 3v12.5c0 2.485-2.015 4.5-4.5 4.5S9 17.985 9 15.5 11.015 11 13.5 11c.835 0 1.62.23 2.292.628L16 11.5V6.121L10 7.621V17.5c0 2.485-2.015 4.5-4.5 4.5S1 19.985 1 17.5 3.015 13 5.5 13c.835 0 1.62.23 2.292.628L8 13.5V3l10-1.5v1.5z" />
  </svg>
);

export default function StreamingLinks({
  links,
  variant = "stacked",
}: StreamingLinksProps) {
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

  // Show "Coming Soon" badge if no streaming links available
  if (platforms.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <motion.div
          className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white/90 font-medium text-sm uppercase tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Coming Soon
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        variant === "stacked"
          ? "flex-col gap-3 w-full max-w-sm"
          : "flex-row gap-4 flex-wrap justify-center"
      }`}
    >
      {platforms.map((platform, index) => (
        <motion.a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={platform.label}
          className="flex items-center justify-center gap-3 h-[56px] px-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium text-base transition-all duration-200 hover:bg-white/25 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <span className="flex-shrink-0">{platform.icon}</span>
          <span>{platform.name}</span>
        </motion.a>
      ))}
    </div>
  );
}
