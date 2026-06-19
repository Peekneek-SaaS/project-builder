import type { ReactNode } from "react";

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {children}
    </div>
  );
}
