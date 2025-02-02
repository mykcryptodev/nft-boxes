import { isAddressEqual, zeroAddress } from "viem";
import { base } from "viem/chains";
import { z } from "zod";

import { SUPPORTED_CHAINS } from "~/constants";
import { COINGECKO_UNKNOWN_IMG } from "~/constants";
import coingeckoList from "~/constants/tokenLists/coingecko.json";
import { DEFAULT_TOKENS } from "~/constants/tokens";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const ETH_ICON = `https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png`;

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
      const tokenIsNative = isAddressEqual(input.tokenAddress, zeroAddress);
      if (tokenIsNative) {
        return ETH_ICON;
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