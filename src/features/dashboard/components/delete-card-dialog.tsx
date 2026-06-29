"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Delete02Icon,
  Loading01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function DeleteCardDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Move to trash",
  loading,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="min-w-0 truncate text-lg">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="wrap-anywhere">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={onConfirm}
            className="flex items-center gap-1"
          >
            {loading ? (
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
                Deleting
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Delete02Icon} />
                {confirmLabel}
              </span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
