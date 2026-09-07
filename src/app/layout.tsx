import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ACCENT_IDS, DEFAULT_ACCENT } from "@/lib/accents";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NumberSmith — Train Smarter. Compete Better.",
  description:
    "The adaptive math competition training platform for Math Kangaroo, MathCounts, AMC, AIME, HMMT, and olympiad mathematics.",
  // iOS ignores the web manifest's icons, so apple-touch-icon must be declared
  // separately for "Add to Home Screen" to pick up the right image.
  appleWebApp: {
    capable: true,
    title: "NumberSmith",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#4338ca",
  // Prevents the zoom-on-input-focus jump that makes an installed web app feel
  // like a website rather than an app.
  initialScale: 1,
  width: "device-width",
  viewportFit: "cover",
};

// Runs before first paint (a plain inline <script>, not deferred) so the page
// never flashes light-then-dark, or default-indigo-then-chosen-colour.
// Respects a stored user choice over the device's prefers-color-scheme;
// ThemeToggle and AccentPicker write those choices.
//
// The accent list is interpolated from ACCENT_IDS rather than hardcoded so it
// can't drift from the CSS, and an unrecognised stored value falls back to the
// default instead of setting an attribute no stylesheet matches.
const NO_FLASH_THEME_SCRIPT = `(function(){try{
var t=localStorage.getItem('theme');
var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark',d);
var a=localStorage.getItem('accent');
var ok=${JSON.stringify(ACCENT_IDS)};
document.documentElement.setAttribute('data-accent',ok.indexOf(a)>-1?a:${JSON.stringify(DEFAULT_ACCENT)});
}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
