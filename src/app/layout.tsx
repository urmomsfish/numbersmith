import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
