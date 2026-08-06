export type ReflectionPlatform =
  | "youtube"
  | "podcast"
  | "telegram";

export type ReflectionItem = {
  number: string;
  title: string;
  format: string;
  platform: ReflectionPlatform;
  href: string | null;
};

export const reflections: readonly ReflectionItem[] = [
  {
    number: "01",
    title: "Canal de YouTube",
    format: "Contenido audiovisual",
    platform: "youtube",
    href: "https://www.youtube.com/@emilianobim",
  },
  {
    number: "02",
    title: "Podcast Metafórico",
    format: "Spotify",
    platform: "podcast",
    href: "https://open.spotify.com/show/033PE3rHRNbHlga66ADR7H",
  },
  {
    number: "03",
    title: "Canal de Telegram",
    format: "Canal de comunicación",
    platform: "telegram",
    href: "https://t.me/emilianobimvivo",
  },
];