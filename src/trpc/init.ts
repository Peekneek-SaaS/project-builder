import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { userId } = await auth();
  return { userId, headers: opts.headers };
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

export const publicProcedure = baseProcedure;
