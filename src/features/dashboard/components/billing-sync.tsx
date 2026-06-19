"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export function BillingSync() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const syncPlan = useMutation(
    trpc.billing.syncPlan.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.billing.getPlan.queryFilter());
      },
    }),
  );
  const syncedRef = useRef(false);

  useEffect(() => {
    if (syncedRef.current) return;
    syncedRef.current = true;
    syncPlan.mutate();
  }, [syncPlan]);

  return null;
}
