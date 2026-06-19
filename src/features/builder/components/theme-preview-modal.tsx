"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CardBackSkeleton,
  CardFrontSkeleton,
  skeletonPreviewData,
} from "@/features/builder/components/card-skeleton-preview";
import type { CardTheme } from "@/lib/card-themes";
import { getThemeStyleClasses } from "@/lib/card-theme-utils";

export function ThemePreviewModal({
  open,
  onOpenChange,
  theme,
  previewName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: CardTheme | null;
  previewName: string;
}) {
  if (!theme) return null;

  const styles = getThemeStyleClasses(theme.id);
  const data = skeletonPreviewData(previewName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{theme.name} preview</DialogTitle>
          <DialogDescription>
            How your card will look with your name. Other details appear as
            placeholders until you fill them in.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-2 lg:flex-row lg:items-start lg:justify-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Front
            </span>
            <CardFrontSkeleton data={data} theme={theme} styles={styles} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Back
            </span>
            <CardBackSkeleton data={data} theme={theme} styles={styles} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
