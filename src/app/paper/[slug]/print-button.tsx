"use client";

import { Button } from "@/components/ui/button";

/** Opens the browser's print dialog. A client component because `window` is
 * not available while rendering on the server. */
export function PrintButton() {
  return <Button onClick={() => window.print()}>Print / Save as PDF</Button>;
}
