import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { base, getChainMetadata } from "thirdweb/chains";
import { z } from "zod";

import { SUPPORTED_CHAINS } from "~/constants";
import { COINGECKO_UNKNOWN_IMG } from "~/constants";
import coingeckoList from "~/constants/tokenLists/coingecko.json";
import { DEFAULT_TOKENS } from "~/constants/tokens";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const coingeckoRouter = createTRPCRouter({
  getTokenPrice: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      type TokenPriceResponse = Record<string, { usd: number }>;
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${input.id}&vs_currencies=usd`);
      const json = (await res.json()) as TokenPriceResponse;
      return json[input.id]?.usd ?? null;
    }),
  getTokenImage: publicProcedure
    .input(z.object({ chainId: z.number(), tokenAddress: z.string() }))
    .mutation(async ({ input }) => {
      // check if the address passed in was native, rely on the chain for that
      const chain = SUPPORTED_CHAINS.find((c) => c.id === input.chainId);
      if (!chain) {
        throw new Error(`Chain ${input.chainId} not supported`);
      }
      const tokenIsNative = input.tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS;
      const chainMetadata = await getChainMetadata(getThirdwebChain(chain));
      if (tokenIsNative && chainMetadata?.icon?.url) {
        return chainMetadata.icon.url;
      }
      // check default tokens for an image
      const token = DEFAULT_TOKENS.find((t) => t.address.toLowerCase() === input.tokenAddress.toLowerCase());
      if (token?.image) {
        return token.image;
      }
      // before making any external calls, lets check the hardcoded json for a fast lookup
      const tokenInList = coingeckoList.tokens.find((t) => t.address.toLowerCase() === input.tokenAddress.toLowerCase());
      if (tokenInList?.logoURI) {
        return tokenInList.logoURI;
      }

      // do not ask coingecko for testnets
      if (chain?.testnet) {
        return COINGECKO_UNKNOWN_IMG;
      }

      type ChainNames = Record<string, string>;
      const coingeckoChainNames = { [base.id]: "base" } as ChainNames;
      const chainName = coingeckoChainNames[input.chainId];
      if (!chainName) throw new Error(`Chain ${input.chainId} not supported by coingecko`);
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${chainName}/contract/${input.tokenAddress}`);
      const json = (await res.json()) as { image: { large: string } };
      return json.image.large ?? COINGECKO_UNKNOWN_IMG;
    }),
});