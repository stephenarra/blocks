import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { modelRouter } from "./routers/model";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  model: modelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
