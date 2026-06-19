"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/features/builder/components/business-card";
import { getTheme } from "@/lib/card-themes";
import { useTRPC } from "@/trpc/client";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { motion } from "motion/react";
import { Chart03Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function AnalyticsIndexPage() {
  const trpc = useTRPC();
  const { data: cards = [], isLoading } = useQuery(
    trpc.card.list.queryOptions(),
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2">
        <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
        <p className="text-sm text-muted-foreground">Loading cards…</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <HugeiconsIcon
            icon={Chart03Icon}
            className="mx-auto text-muted-foreground"
          />
          <p className="mt-4 text-sm font-medium">No cards to analyze yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and publish a card to start tracking views and link clicks.
          </p>
          <Button asChild className="mt-4">
            <Link href="/create">Create a card</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <FadeIn>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a card to view its performance.
        </p>
      </FadeIn>

      <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const theme = getTheme(card.themeId);
          const title = card.cardData.name || theme.name;

          return (
            <StaggerItem key={card.id}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/analytics/${card.id}`}
                  className="group block rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-lg hover:shadow-black/5"
                >
                  <div className="flex h-36 items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                    <BusinessCard
                      data={card.cardData}
                      theme={theme}
                      displayMode="front"
                      className="pointer-events-none shadow-none ring-0"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="truncate text-sm font-medium">{title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {card.viewCount.toLocaleString()} total views ·{" "}
                      {theme.name}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
