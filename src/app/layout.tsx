import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Mono, Space_Grotesk } from "next/font/google";
import { ThemeSync } from "@/components/theme-sync";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  weight: "400",
  variable: "--font-dm-mono",
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
  // Graphite, matching --brand-900. Was still the old indigo.
  themeColor: "#1c1917",
  // Prevents the zoom-on-input-focus jump that makes an installed web app feel
  // like a website rather than an app.
  initialScale: 1,
  width: "device-width",
  viewportFit: "cover",
};

// Runs before first paint (a plain inline <script>, not deferred) so the page
// never flashes light-then-dark. Respects a stored user choice over the
// device's prefers-color-scheme; ThemeToggle writes that choice.
//
// The stored theme is only honored while logged in — signalled by the
// non-httpOnly numbersmith_auth cookie set alongside the session cookie in
// auth.ts. Logged out (including right after logout, when localStorage still
// has the old choice), the page always renders light so a logged-out visitor
// never sees another session's personalization.
//
// The retired `tint` key is cleared rather than ignored, so a background colour
// someone picked before the picker was removed doesn't sit dormant in their
// browser looking like a live preference.
const NO_FLASH_THEME_SCRIPT = `(function(){try{
var loggedIn=document.cookie.indexOf('numbersmith_auth=')>-1;
var t=loggedIn?localStorage.getItem('theme'):null;
var d=t==='dark'||(!t&&loggedIn&&window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark',d);
localStorage.removeItem('tint');
document.documentElement.removeAttribute('data-tint');
}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceGrotesk.variable} ${dmMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
