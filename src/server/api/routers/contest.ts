import { createThirdwebClient, getContract } from "thirdweb";
import { z } from "zod";

import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { contestIdCounter } from "~/thirdweb/84532/0x7bbc05e8e8eada7845fa106dfd3fc41a159b90f5";

const DEFAULT_PAGE_SIZE = 10;

export const contestRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({
      start: z.number().optional(),
      limit: z.number().optional().default(DEFAULT_PAGE_SIZE),
    }))
    .query(async ({ input }) => {
      const client = createThirdwebClient({
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
      });
      const contract = getContract({
        address: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
        client,
        chain: getThirdwebChain(DEFAULT_CHAIN),
      });
      const totalContests = await contestIdCounter({
        contract
      });
      const start = input.start ?? Math.max(0, Number(totalContests) - input.limit);
      const end = Math.min(start + input.limit, Number(totalContests));
      
      const contestIds = Array.from(
        { length: end - start },
        (_, i) => Number(totalContests) - 1 - (start + i)
      );

      return contestIds.map(id => id.toString());
    }),
});
