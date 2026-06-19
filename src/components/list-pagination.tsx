"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTotalPages, PAGE_SIZE } from "@/lib/pagination";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ListPagination({
  page,
  totalItems,
  pageSize = PAGE_SIZE,
  onPageChange,
  className,
}: {
  page: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const totalPages = getTotalPages(totalItems, pageSize);

  if (totalItems <= pageSize) {
    return null;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="hidden text-xs text-muted-foreground sm:inline">
        {start}–{end} of {totalItems}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
      </Button>
      <span className="min-w-16 text-center text-xs tabular-nums text-muted-foreground">
        {page} / {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
      </Button>
    </div>
  );
}
