import { isAddress } from "viem";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  setIdentity: protectedProcedure.input(z.object({
    name: z.string(),
    image: z.string().optional(),
  })).mutation(async ({ ctx, input }) => {
    return await ctx.db.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: input,
    });
  }),
  getIdentity: publicProcedure.input(z.object({
    address: z.string(),
  })).query(async ({ ctx, input }) => {
    if (!isAddress(input.address)) {
      return null;
    }
    return await ctx.db.user.findUnique({
      where: { address: input.address },
    });
  }),
});
