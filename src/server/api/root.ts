import { coingeckoRouter } from "~/server/api/routers/coingecko";
import { contestRouter } from "~/server/api/routers/contest";
import { gameRouter } from "~/server/api/routers/game";
import { identityRouter } from "~/server/api/routers/identity";
import { safetyRouter } from "~/server/api/routers/safety";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  game: gameRouter,
  contest: contestRouter,
  coingecko: coingeckoRouter,
  safety: safetyRouter,
  identity: identityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

