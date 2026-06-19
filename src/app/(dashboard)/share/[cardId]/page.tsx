import { Suspense } from "react";

import { ShareView } from "@/features/share/views/share-view";

export default async function ShareCardPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <ShareView cardId={cardId} />
    </Suspense>
  );
}
