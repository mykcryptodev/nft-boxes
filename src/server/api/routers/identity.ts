import { getName } from '@coinbase/onchainkit/identity';
import { createThirdwebClient } from "thirdweb";
import { getSocialProfiles,type SocialProfile } from "thirdweb/social";
import { isAddress } from "viem";
import { base } from "viem/chains";
import { z } from "zod";

import { CACHE_IDENTITIES } from '~/constants';
import { env } from "~/env";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { getCachedIdentity, setCachedIdentity } from "~/server/redis";

const replaceIpfsUrl = (url: string) => {
  return url.replace('ipfs.decentralized-content.com', 'ipfs.io');
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
        if (CACHE_IDENTITIES) {
          await setCachedIdentity(user.address, identityData);
        }
      }

      return user;
    }),

  getOrFetchIdentity: publicProcedure
    .input(z.object({
      address: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      if (!isAddress(input.address)) {
        throw new Error("Invalid address");
      }

      // First try to get from cache
      if (CACHE_IDENTITIES) {
        const cachedIdentity = await getCachedIdentity(input.address);
        if (cachedIdentity) {
          return cachedIdentity;
        }
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
        if (CACHE_IDENTITIES) {
          // Cache the existing identity before returning
          await setCachedIdentity(input.address, existingIdentity);
        }
        return existingIdentity;
      }
      
      const client = createThirdwebClient({
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      });

      try {
        const [profiles, basename] = await Promise.all([
          getSocialProfiles({
            address: input.address,
            client,
          }),
          getName({ address: input.address, chain: base })
        ]) as [SocialProfile[], string | null];

        const name = basename ?? profiles.find(p => 'name' in p && typeof p.name === 'string')?.name ?? null;
        const rawImage = profiles.find(p => 'avatar' in p && typeof p.avatar === 'string' && p.avatar.startsWith('https://'))?.avatar ?? null;
        const image = rawImage ? replaceIpfsUrl(rawImage) : null;
        const bio = profiles.find(p => 'bio' in p && typeof p.bio === 'string')?.bio ?? null;

        const thereAreChanges = () => {
          if (!existingIdentity) {
            return true;
          }
          return existingIdentity && (
            (existingIdentity.name ?? null) !== name || 
            (existingIdentity.image ?? null) !== image || 
            (existingIdentity.bio ?? null) !== bio
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
          if (CACHE_IDENTITIES) {
            await setCachedIdentity(input.address, newIdentity);
          }
          return newIdentity;
        }

        // Cache the existing identity before returning
        if (existingIdentity && CACHE_IDENTITIES) {
          await setCachedIdentity(input.address, existingIdentity);
        }
        return existingIdentity;
      } catch (error) {
        console.error('Error fetching social profiles:', error);
        return existingIdentity;
      }
    })
}); 
