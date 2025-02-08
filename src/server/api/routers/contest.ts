import { createThirdwebClient, getContract } from "thirdweb";
import { getAllOwners } from "thirdweb/extensions/erc721";
import { isAddressEqual } from "viem";
import { z } from "zod";

import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type CachedContest, getCachedContest, getCachedPlayersInContest, invalidateContestCache, setCachedContest, setCachedPlayersInContest } from "~/server/redis";
import { boxes, contestIdCounter } from "~/thirdweb/84532/0x7bbc05e8e8eada7845fa106dfd3fc41a159b90f5";

const DEFAULT_PAGE_SIZE = 10;

const contestSchema = z.object({
  id: z.bigint(),
  gameId: z.bigint(),
  creator: z.string(),
  boxCost: z.object({
    currency: z.string(),
    decimals: z.number(),
    symbol: z.string(),
    name: z.string(),
    amount: z.bigint(),
    image: z.string(),
  }),
  boxesCanBeClaimed: z.boolean(),
  rewardsPaid: z.object({
    q1Paid: z.boolean(),
    q2Paid: z.boolean(),
    q3Paid: z.boolean(),
    finalPaid: z.boolean(),
  }),
  totalRewards: z.bigint(),
  boxesClaimed: z.bigint(),
  randomValuesSet: z.boolean(),
  cols: z.array(z.number()),
  rows: z.array(z.number()),
  boxesAddress: z.string(),
  q1Paid: z.boolean(),
  q2Paid: z.boolean(),
  q3Paid: z.boolean(),
  finalPaid: z.boolean(),
});

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

      return {
        ids: contestIds.map(id => id.toString()),
        total: Number(totalContests),
      };
    }),

  getCached: publicProcedure
    .input(z.object({
      contestId: z.string(),
    }))
    .query(async ({ input }) => {
      return await getCachedContest(input.contestId);
    }),

  setCache: publicProcedure
    .input(z.object({
      contestId: z.string(),
      contestData: contestSchema,
    }))
    .mutation(async ({ input }) => {
      await setCachedContest(input.contestId, input.contestData as CachedContest);
      return true;
    }),

  invalidateCache: publicProcedure
    .input(z.object({
      contestId: z.string(),
    }))
    .mutation(async ({ input }) => {
      await invalidateContestCache(input.contestId);
      return true;
    }),
  
  getAllPlayersInContest: publicProcedure
    .input(z.object({
      contestId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // check the cache to see if the players are already cached
      const cachedPlayers = await getCachedPlayersInContest(input.contestId);
      if (cachedPlayers) {
        return cachedPlayers;
      }
      // if not, get all the players in the contest
      const startingTokenId = Number(input.contestId) * 100;
      const numTokenIds = 100;
      const client = createThirdwebClient({
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
      });
      const contestsContract = getContract({
        address: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
        client,
        chain: getThirdwebChain(DEFAULT_CHAIN),
      });
      const boxesAddress = await boxes({
        contract: contestsContract,
      });
      const boxesContract = getContract({
        address: boxesAddress,
        client,
        chain: getThirdwebChain(DEFAULT_CHAIN),
      });
      const owners = await getAllOwners({
        contract: boxesContract, // Your ERC-721 contract instance
        start: startingTokenId, // Starting token ID
        count: numTokenIds, // Number of token IDs to retrieve owners for
      });
      // make a unique list of owners with their token counts
      const ownerCounts = owners.reduce((acc, { owner }) => {
        acc[owner] = (acc[owner] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const uniqueOwners = Object.keys(ownerCounts).filter(owner => !isAddressEqual(owner, CONTEST_CONTRACT[DEFAULT_CHAIN.id]!));
      // make a map of owners to their token ids
      const tokenIdsToOwners = owners.reduce((acc, { owner, tokenId }) => {
        acc[Number(tokenId)] = owner;
        return acc;
      }, {} as Record<number, string>);
      // fetch the identities for each owner
      const identities = await ctx.db.user.findMany({
        where: {
          address: {
            in: uniqueOwners,
          },
        },
        select: {
          address: true,
          name: true,
          image: true,
          bio: true,
        },
      });
      
      const playersData = {
        players: uniqueOwners,
        identities,
        ownerCounts,
        tokenIdsToOwners,
      };
      
      // set the data in the cache
      await setCachedPlayersInContest(input.contestId, playersData);
      return playersData;
    }),
});
