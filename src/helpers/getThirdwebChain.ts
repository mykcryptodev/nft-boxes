import { arbitrum, avalanche, base, baseSepolia, mainnet, optimism, polygon } from "thirdweb/chains";
import { type Chain } from "viem";
export const getThirdwebChain = (chain: Chain) => {
  switch (chain.id) {
    case arbitrum.id:
      return arbitrum;
    case avalanche.id:
      return avalanche;
    case base.id:
      return base;
    case baseSepolia.id:
      return baseSepolia;
    case mainnet.id:
      return mainnet;
    case optimism.id:
      return optimism;
    case polygon.id:
      return polygon;
    default:
      return base;
  }
};