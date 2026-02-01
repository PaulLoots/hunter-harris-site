export interface ColorPalette {
  vibrant: string;
  darkVibrant: string;
  lightVibrant: string;
  muted: string;
  darkMuted: string;
  lightMuted: string;
  dominant: string;
}

export interface StreamingLinks {
  spotify?: string;
  appleMusic?: string;
  youtubeMusic?: string;
}

export interface Release {
  id: string;
  title: string;
  subtitle?: string;
  type: "album" | "ep" | "single";
  releaseDate: string;
  artworkPath: string;
  palette: ColorPalette;
  streamingLinks: StreamingLinks;
  featured?: boolean;
}
