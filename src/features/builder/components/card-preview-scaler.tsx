"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CardPreviewScalerProps = {
  children: ReactNode;
  className?: string;
  minHeightClass?: string;
  /** Single card side — fills the preview with tighter padding. */
  variant?: "default" | "single";
};

type Layout = {
  naturalWidth: number;
  naturalHeight: number;
  scale: number;
};

/**
 * Scales card preview to fit the preview area, centered on every screen size.
 */
export function CardPreviewScaler({
  children,
  className,
  minHeightClass = "min-h-[min(640px,calc(100vh-14rem))]",
  variant = "default",
}: CardPreviewScalerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);

  const padding = variant === "single" ? 12 : 20;

  function computeScale(
    container: HTMLElement,
    naturalWidth: number,
    naturalHeight: number,
  ) {
    const availableWidth = Math.max(0, container.clientWidth - padding * 2);
    const availableHeight = Math.max(0, container.clientHeight - padding * 2);
    if (availableWidth <= 0 || availableHeight <= 0) return 1;

    const scale = Math.min(
      availableWidth / naturalWidth,
      availableHeight / naturalHeight,
    );
    return Number.isFinite(scale) && scale > 0 ? scale : 1;
  }

  // Re-measure when card content changes.
  useLayoutEffect(() => {
    setLayout(null);
  }, [children, variant]);

  useLayoutEffect(() => {
    let frame = 0;

    const update = () => {
      const container = containerRef.current;
      if (!container) return;

      if (!layout) {
        const measure = measureRef.current;
        if (!measure) return;

        const naturalWidth = measure.offsetWidth;
        const naturalHeight = measure.offsetHeight;
        if (!naturalWidth || !naturalHeight) {
          frame = requestAnimationFrame(update);
          return;
        }

        setLayout({
          naturalWidth,
          naturalHeight,
          scale: computeScale(container, naturalWidth, naturalHeight),
        });
        return;
      }

      const nextScale = computeScale(
        container,
        layout.naturalWidth,
        layout.naturalHeight,
      );
      if (Math.abs(nextScale - layout.scale) > 0.001) {
        setLayout({ ...layout, scale: nextScale });
      }
    };

    update();
    frame = requestAnimationFrame(update);

    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [layout, children, variant, padding]);

  const scaledWidth = layout ? layout.naturalWidth * layout.scale : 0;
  const scaledHeight = layout ? layout.naturalHeight * layout.scale : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid w-full min-w-0 max-w-full place-items-center",
        minHeightClass,
        className,
      )}
      style={{ padding }}
    >
      {/* Hidden measurer — only rendered while layout is unknown */}
      {!layout ? (
        <div ref={measureRef} className="invisible w-fit" aria-hidden>
          {children}
        </div>
      ) : null}

      {/* Visible scaled card — centered by grid once dimensions are known */}
      {layout ? (
        <div
          className="shrink-0 overflow-hidden"
          style={{ width: scaledWidth, height: scaledHeight }}
        >
          <div
            style={{
              width: layout.naturalWidth,
              height: layout.naturalHeight,
              transform:
                layout.scale !== 1 ? `scale(${layout.scale})` : undefined,
              transformOrigin: "top left",
            }}
          >
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}
