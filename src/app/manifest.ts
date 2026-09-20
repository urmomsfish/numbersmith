import type { MetadataRoute } from "next";

/** Makes the site installable to a phone home screen ("Add to Home Screen" on
 * iOS, an install prompt on Android). Served at /manifest.webmanifest. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NumberSmith | Competition Math Training",
    short_name: "NumberSmith",
    description:
      "Adaptive training for math competitions. Take a placement test, get a personalized plan, and practice problems matched to your level.",
    start_url: "/dashboard",
    // Opens without browser chrome so it reads as an app rather than a tab.
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f6f2",
    theme_color: "#f7f6f2",
    categories: ["education"],
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
