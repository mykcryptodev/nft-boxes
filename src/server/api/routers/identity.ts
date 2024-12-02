import { getName } from '@coinbase/onchainkit/identity';
import { createThirdwebClient } from "thirdweb";
import { getSocialProfiles } from "thirdweb/social";
import { isAddress } from "viem";
import { base } from "viem/chains";
import { z } from "zod";

import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const KNOWN_BROKEN_IMAGES: Record<string, boolean> = {
  'https://ipfs.decentralized-content.com/ipfs/bafkreidt64lfzm2aqretsn4sweh2vxdweik2q7op753uwyk7tmxlu6dx5y': true
}

export const identityRouter = createTRPCRouter({
  getOrFetchIdentity: publicProcedure
    .input(z.object({
      address: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      if (!isAddress(input.address)) {
        throw new Error("Invalid address");
      }

      // First try to find existing identity
      const existingIdentity = await ctx.db.user.findUnique({
        where: { address: input.address },
        select: {
          name: true,
          image: true,
          bio: true,
        },
      });

      if (existingIdentity?.name && existingIdentity?.image) {
        return existingIdentity;
      }
      
      const client = createThirdwebClient({
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      });

      const profiles = await getSocialProfiles({
        address: input.address,
        client,
      });

      const basename = await getName({ address: input.address, chain: base });

      const name = basename ?? profiles.find(p => p.name)?.name;
      const image = profiles.find(p => p.avatar?.startsWith('https://') && !KNOWN_BROKEN_IMAGES[p.avatar])?.avatar;
      const bio = profiles.find(p => p.bio)?.bio;

      if (existingIdentity?.name !== name || existingIdentity?.image !== image) {
        // update the existing identity
        await ctx.db.user.update({
          where: { address: input.address },
          data: { name, image, bio },
        });
      }

      // If not found and we have new data, create a new record
      if (name || image || bio) {
        const newIdentity = await ctx.db.user.create({
          data: {
            address: input.address,
            name,
            image,
            bio,
          },
          select: {
            name: true,
            image: true,
            bio: true,
          },
        });
        return newIdentity;
      }

      return null;
    }),
}); 