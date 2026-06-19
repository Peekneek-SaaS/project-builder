import { createTRPCRouter } from "../init";
import { analyticsRouter } from "./analytics";
import { billingRouter } from "./billing";
import { cardRouter } from "./card";
import { resumeRouter } from "./resume";

export const appRouter = createTRPCRouter({
  resume: resumeRouter,
  card: cardRouter,
  analytics: analyticsRouter,
  billing: billingRouter,
});

export type AppRouter = typeof appRouter;
