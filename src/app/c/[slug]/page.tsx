import { Suspense } from "react";

import { PublicCardView } from "@/features/share/views/public-card-view";

export default async function PublicCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-sm text-muted-foreground">Loading</p>
        </div>
      }
    >
      <PublicCardView slug={slug} />
    </Suspense>
  );
}
