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
    <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208c-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03c.525 0 1.048-.034 1.57-.1.823-.106 1.597-.35 2.296-.81a5.028 5.028 0 0 0 1.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 0 1 1.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.457-.23.51-.516.014-.063.02-.13.02-.193 0-1.815 0-3.63-.002-5.443 0-.062-.01-.125-.026-.185-.04-.15-.15-.233-.302-.254-.108-.015-.217-.024-.326-.035l-5.197-.93c-.03-.006-.064-.01-.096-.01-.184 0-.308.107-.325.288-.007.063-.01.13-.01.193-.002 2.58 0 5.16-.003 7.74 0 .113-.013.226-.042.336-.138.53-.526.87-1.028 1.017-.784.23-1.574.23-2.35-.05-.77-.278-1.27-.82-1.446-1.638-.152-.71.035-1.36.555-1.912.325-.345.725-.555 1.164-.695a5.34 5.34 0 0 1 1.032-.183c.218-.02.437-.037.656-.06.194-.02.326-.117.377-.304.014-.05.02-.103.02-.155.002-3.452 0-6.903.003-10.355 0-.05.004-.102.013-.15.026-.144.115-.233.26-.263.056-.01.112-.02.168-.023 1.984-.36 3.967-.717 5.95-1.076.36-.065.72-.13 1.08-.194.066-.01.14-.01.203.007.11.03.18.103.224.204.014.033.024.068.024.103.003 1.99.003 3.978 0 5.968z" />
  </svg>
);

const YouTubeMusicIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
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
    {
      name: "YouTube Music",
      url: links.youtubeMusic,
      icon: <YouTubeMusicIcon />,
      label: "Listen on YouTube Music",
    },
  ].filter((platform) => platform.url);

  return (
    <div
      className={`flex ${
        variant === "stacked"
          ? "flex-col gap-3 w-full max-w-md px-6"
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
          className="flex items-center justify-center gap-3 h-[56px] px-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-medium text-base transition-all duration-200 hover:bg-white/25 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50"
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
