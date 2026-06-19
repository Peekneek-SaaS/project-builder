import { Suspense } from "react";
import BuilderView from "@/features/builder/views/builder-view";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

export default function BuilderResumePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
            Loading
          </p>
        </div>
      }
    >
      <BuilderView />
    </Suspense>
  );
}
