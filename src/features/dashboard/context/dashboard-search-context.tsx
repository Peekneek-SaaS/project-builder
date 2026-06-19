"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const SEARCH_DEBOUNCE_MS = 1500;

type DashboardSearchContextValue = {
  query: string;
  debouncedQuery: string;
  isDebouncing: boolean;
  setQuery: (query: string) => void;
  clearQuery: () => void;
};

const DashboardSearchContext =
  createContext<DashboardSearchContextValue | null>(null);

export function DashboardSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const value = useMemo(
    () => ({
      query,
      debouncedQuery,
      isDebouncing: query.trim() !== debouncedQuery.trim(),
      setQuery,
      clearQuery: () => {
        setQuery("");
        setDebouncedQuery("");
      },
    }),
    [query, debouncedQuery],
  );

  return (
    <DashboardSearchContext.Provider value={value}>
      {children}
    </DashboardSearchContext.Provider>
  );
}

export function useDashboardSearch() {
  const context = useContext(DashboardSearchContext);
  if (!context) {
    throw new Error(
      "useDashboardSearch must be used within DashboardSearchProvider",
    );
  }
  return context;
}
