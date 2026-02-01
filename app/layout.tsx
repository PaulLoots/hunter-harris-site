import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hunter Harris — Music",
  description:
    "Listen to music by Hunter Harris on Spotify, Apple Music, and more.",
  openGraph: {
    title: "Hunter Harris — Music",
    description: "Listen to music by Hunter Harris",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hunter Harris — Music",
    description: "Listen to music by Hunter Harris",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
