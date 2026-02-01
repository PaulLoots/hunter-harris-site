"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ArtworkProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function Artwork({ src, alt, priority = false }: ArtworkProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className="relative w-full flex justify-center">
      <motion.div
        style={{ y }}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative w-[75vw] max-w-[400px] aspect-square"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 75vw, 400px"
          className="rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] object-cover"
        />
      </motion.div>
    </div>
  );
}
