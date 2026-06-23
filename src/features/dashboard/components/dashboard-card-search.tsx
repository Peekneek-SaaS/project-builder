"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { getCardBuilderLabel } from "@/lib/card-data";
import { filterCardsByQuery } from "@/lib/card-search";
import { getTheme } from "@/lib/card-themes";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useDashboardSearch } from "@/features/dashboard/context/dashboard-search-context";
import {
  Cancel01Icon,
  CreditCardIcon,
  Loading03Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

export function DashboardCardSearch({ className }: { className?: string }) {
  const trpc = useTRPC();
  const { query, debouncedQuery, isDebouncing, setQuery, clearQuery } =
    useDashboardSearch();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: cards = [] } = useQuery(trpc.card.list.queryOptions());

  const results = useMemo(
    () => filterCardsByQuery(cards, debouncedQuery),
    [cards, debouncedQuery],
  );

  const showResults = open && debouncedQuery.trim().length > 0;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function getShareHref(cardId: string) {
    return `/share/${cardId}`;
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full min-w-32 max-w-sm", className)}
    >
      <HugeiconsIcon
        icon={Search01Icon}
        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        placeholder="Search by name or theme"
        className="w-full px-8 pr-9"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        aria-label="Search cards"
        aria-expanded={showResults}
        aria-autocomplete="list"
      />
      {query ? (
        <Button
          type="button"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded px-1.5 text-xs text-muted-foreground hover:text-foreground hover:no-underline"
          onClick={() => {
            clearQuery();
            setOpen(false);
          }}
          variant="link"
        >
          <HugeiconsIcon icon={Cancel01Icon} />
        </Button>
      ) : null}

      {showResults ? (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          {isDebouncing ? (
            <p className="px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
              <HugeiconsIcon
                icon={Loading03Icon}
                size="18"
                className="animate-spin"
              />
              Searching
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No cards match &ldquo;{debouncedQuery}&rdquo;
            </p>
          ) : (
            <ul className="max-h-72 overflow-y-auto py-1">
              {results.map((card) => {
                const theme = getTheme(card.themeId);
                const name = getCardBuilderLabel(card.cardData) || theme.name;

                return (
                  <li key={card.id}>
                    <Link
                      href={getShareHref(card.id)}
                      className={cn(
                        "flex flex-col gap-0.5 px-4 py-2.5 text-left transition-colors hover:bg-muted",
                      )}
                      onClick={() => {
                        clearQuery();
                        setOpen(false);
                      }}
                    >
                      <span className="truncate text-sm font-medium flex items-center gap-2">
                        <HugeiconsIcon icon={CreditCardIcon} size={18} />
                        {name} ·
                        <span className="truncate text-xs text-muted-foreground">
                          {theme.name}
                          {card.cardData.title
                            ? ` ${card.cardData.title}`
                            : null}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
