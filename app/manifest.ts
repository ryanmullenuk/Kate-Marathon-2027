import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kate Runs London 2027",
    short_name: "Kate Runs 27",
    description:
      "Kate's London Marathon 2027 journey for Young Epilepsy, in memory of Lauren Szumski.",
    start_url: "/",
    display: "standalone",
    background_color: "#08b875",
    theme_color: "#3b278c",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
