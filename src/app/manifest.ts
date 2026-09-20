import type { MetadataRoute } from "next";

/** Makes the site installable to a phone home screen ("Add to Home Screen" on
 * iOS, an install prompt on Android). Served at /manifest.webmanifest. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NumberSmith — Competition Math Training",
    short_name: "NumberSmith",
    description:
      "Adaptive training for math competitions. Take a placement test, get a personalized plan, and practice problems matched to your level.",
    start_url: "/dashboard",
    // Opens without browser chrome so it reads as an app rather than a tab.
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8fafc",
    theme_color: "#4338ca",
    categories: ["education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android masks adaptive icons to its own shape; the mark has enough
      // padding to survive the crop.
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
