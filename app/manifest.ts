import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quntam Gen",
    short_name: "Quntam Gen",
    description: "Web development, SEO, digital marketing, Meta ads, app development, and AI automation.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#C81E2C",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
