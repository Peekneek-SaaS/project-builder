import { Suspense } from "react";

import { EmbedCardView } from "@/features/share/views/embed-card-view";

export default async function EmbedCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[480px] items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading card…</p>
        </div>
      }
    >
      <EmbedCardView slug={slug} />
    </Suspense>
  );
}
