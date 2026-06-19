import { createTRPCRouter, protectedProcedure } from "../init";
import {
  getBillingProfile,
  syncBillingPlanFromClerk,
} from "@/lib/billing";

export const billingRouter = createTRPCRouter({
  getPlan: protectedProcedure.query(async ({ ctx }) => {
    return getBillingProfile(ctx.userId);
  }),

  syncPlan: protectedProcedure.mutation(async ({ ctx }) => {
    await syncBillingPlanFromClerk(ctx.userId);
    return getBillingProfile(ctx.userId);
  }),
});
