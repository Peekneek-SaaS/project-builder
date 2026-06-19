"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PAGE_SIZE } from "@/lib/pagination";

export function useInfiniteScroll<T>(
  items: T[],
  options?: { pageSize?: number; resetKey?: string | number },
) {
  const pageSize = options?.pageSize ?? PAGE_SIZE;
  const resetKey = options?.resetKey ?? "";
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const itemsLengthRef = useRef(items.length);
  const visibleCountRef = useRef(visibleCount);
  const isLoadingMoreRef = useRef(false);

  itemsLengthRef.current = items.length;
  visibleCountRef.current = visibleCount;

  useEffect(() => {
    setVisibleCount(pageSize);
    setIsLoadingMore(false);
    isLoadingMoreRef.current = false;
  }, [resetKey, pageSize]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    if (isLoadingMoreRef.current) return;
    if (visibleCountRef.current >= itemsLengthRef.current) return;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    window.setTimeout(() => {
      setVisibleCount((count) =>
        Math.min(count + pageSize, itemsLengthRef.current),
      );
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }, 200);
  }, [pageSize]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return {
    visibleItems,
    hasMore,
    isLoadingMore,
    sentinelRef,
    totalCount: items.length,
    visibleCount: visibleItems.length,
  };
}
