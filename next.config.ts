import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Smith AI accepts screenshots, and a Server Action's body defaults to a
      // 1 MB cap — which a base64 image clears easily (base64 is ~4/3 the size
      // of the bytes it encodes). The composer downscales before sending and
      // the action rejects anything over 4 MB of base64 with a readable
      // message; this sits above that so the app's own check is what fires,
      // rather than an opaque framework-level rejection with no error text.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
