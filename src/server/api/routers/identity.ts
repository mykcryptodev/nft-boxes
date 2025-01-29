import { getName } from '@coinbase/onchainkit/identity';
import { createThirdwebClient } from "thirdweb";
import { getSocialProfiles } from "thirdweb/social";
import { isAddress } from "viem";
import { base } from "viem/chains";
import { z } from "zod";

import { env } from "~/env";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { getCachedIdentity, setCachedIdentity } from "~/server/redis";

const KNOWN_BROKEN_IMAGES: Record<string, boolean> = {
  'https://ipfs.decentralized-content.com/ipfs/bafkreidt64lfzm2aqretsn4sweh2vxdweik2q7op753uwyk7tmxlu6dx5y': true
}

export const identityRouter = createTRPCRouter({
  setIdentity: protectedProcedure
    .input(z.object({
      name: z.string(),
      image: z.string().optional(),
      bio: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: input,
        select: {
          address: true,
          name: true,
          image: true,
          bio: true,
        },
      });

      // If the user has an address, update the cache with the new identity
      if (user.address) {
        const identityData = {
          name: user.name,
          image: user.image,
          bio: user.bio,
        };
        await setCachedIdentity(user.address, identityData);
      }

      return user;
    }),

  getOrFetchIdentity: publicProcedure
    .input(z.object({
      address: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      console.log('getOrFetchIdentity', input.address);
      if (!isAddress(input.address)) {
        throw new Error("Invalid address");
      }

      // First try to get from cache
      const cachedIdentity = await getCachedIdentity(input.address);
      console.log('cachedIdentity', cachedIdentity);
      if (cachedIdentity) {
        return cachedIdentity;
      }

      // Then try to find existing identity in database
      const existingIdentity = await ctx.db.user.findUnique({
        where: { address: input.address },
        select: {
          name: true,
          image: true,
          bio: true,
        },
      });

      if (existingIdentity?.name && existingIdentity?.image) {
        console.log('setting cache', existingIdentity);
        // Cache the existing identity before returning
        await setCachedIdentity(input.address, existingIdentity);
        return existingIdentity;
      }
      
      const client = createThirdwebClient({
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      });

      const [profiles, basename] = await Promise.all([
        getSocialProfiles({
          address: input.address,
          client,
        }),
        getName({ address: input.address, chain: base })
      ]);

      const name = basename ?? profiles.find(p => p.name)?.name;
      const image = profiles.find(p => p.avatar?.startsWith('https://') && !KNOWN_BROKEN_IMAGES[p.avatar])?.avatar;
      const bio = profiles.find(p => p.bio)?.bio;

      const thereAreChanges = () => {
        if (!existingIdentity) {
          return true;
        }
        return existingIdentity && (
          (existingIdentity.name ?? null) !== (name ?? null) || 
          (existingIdentity.image ?? null) !== (image ?? null) || 
          (existingIdentity.bio ?? null) !== (bio ?? null)
        );
      }

      if (thereAreChanges()) {
        const newIdentity = await ctx.db.user.upsert({
          where: { address: input.address },
          update: {
            name,
            image,
            bio,
          },
          create: {
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
        // Cache the new identity before returning
        console.log('setting cache', newIdentity);
        await setCachedIdentity(input.address, newIdentity);
        return newIdentity;
      }

      // Cache the existing identity before returning
      if (existingIdentity) {
        console.log('setting cache', existingIdentity);
        await setCachedIdentity(input.address, existingIdentity);
      }
      return existingIdentity;
    })
}); 
