import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Career HQ - Study Abroad Platform",
    short_name: "Career HQ",
    description:
      "Find the perfect university and course for your international education journey",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#006FEE",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
