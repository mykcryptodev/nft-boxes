import { Buy } from '@coinbase/onchainkit/buy'; 
import { FundButton } from "@coinbase/onchainkit/fund";
import { SwapDefault } from "@coinbase/onchainkit/swap";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { toTokens } from "thirdweb";
import { isAddressEqual, zeroAddress } from "viem";
import { base } from "viem/chains";
import { useAccount,useBalance } from 'wagmi';

import { DEFAULT_TOKENS } from "~/constants/tokens";
import { type Contest } from "~/types/contest";


type Props = {
  contest: Contest;
  onSwapToggle: (isOpen: boolean) => void;
}

export const Price: FC<Props> = ({ contest, onSwapToggle }) => {
  const queryParams = new URLSearchParams({
    address: contest.boxCost.currency,
    decimals: contest.boxCost.decimals.toString(),
    name: contest.boxCost.name,
    symbol: contest.boxCost.symbol,
    image: contest.boxCost.image,
    contestId: contest.id.toString(),
  }).toString();
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: isAddressEqual(contest.boxCost.currency, zeroAddress) 
      ? undefined 
      : contest.boxCost.currency,
  });
  console.log("================================================");
  console.log("PRICE");
  console.log("================================================");
  console.log("address", contest.boxCost.currency);
  console.log(
    "isAddressEqual(address, zeroAddress)",
    isAddressEqual(contest.boxCost.currency, zeroAddress)
  );
  console.log("name", contest.boxCost.name);
  console.log("symbol", contest.boxCost.symbol);
  console.log("image", contest.boxCost.image);
  console.log("contestId", contest.id);
  console.log("================================================");
  const Stats: FC = () => {
    return (
      <div className="flex flex-row overflow-x-scroll sm:max-w-full max-w-sm">
        <div className="stats">
          <div className="stat">
            <div className="stat-title">Pot</div>
            <div className="stat-figure text-secondary">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <Image src={contest.boxCost.image} width={64} height={64} alt={contest.boxCost.name} />
                </div>
              </div>
            </div>
            <div className="stat-value">
              {toTokens(contest.totalRewards, contest.boxCost.decimals)} {contest.boxCost.symbol}
            </div>
            <div className="stat-actions">
              <label htmlFor="swap-drawer" className="drawer-button btn btn-sm hidden sm:flex w-fit">
                Get {contest.boxCost.symbol}
              </label>
              <Link href={`/fund?${queryParams}`} className="btn btn-sm sm:hidden">
                Get {contest.boxCost.symbol}
              </Link>
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Price Per Box</div>
            <div className="stat-value">
              {toTokens(contest.boxCost.amount, contest.boxCost.decimals)} {contest.boxCost.symbol}
            </div>
            <div className="stat-actions">
              <span className="text-sm">
                Your {contest.boxCost.symbol}: {Number(toTokens(balance?.value ?? 0n, balance?.decimals ?? 0)).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}
              </span>
            </div>
            <div className="stat-figure text-secondary">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <Image src={contest.boxCost.image} width={64} height={64} alt={contest.boxCost.name} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:hidden flex overflow-x-auto">
        <Stats />
      </div>
      <div className="sm:flex hidden drawer drawer-end">
        <input 
          id="swap-drawer" 
          type="checkbox" 
          className="drawer-toggle" 
          onChange={(e) => onSwapToggle(e.target.checked)} 
        />
        <div className="drawer-content flex flex-row items-center justify-center">
          <Stats />
        </div>
        <div className="drawer-side">
          <label htmlFor="swap-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className={`bg-base-200 min-h-full w-5/6 p-4 flex flex-col gap-2 items-center justify-center`}>
            <div className="text-4xl font-bold">Buy</div>
            <p className="mb-2">Buy with services like Coinbase and Apple Pay</p>
            <Buy
              toToken={{
                address: isAddressEqual(contest.boxCost.currency, zeroAddress) 
                  ? "" 
                  : contest.boxCost.currency,
                chainId: base.id,
                decimals: contest.boxCost.decimals,
                name: contest.boxCost.name,
                symbol: contest.boxCost.symbol,
                image: contest.boxCost.image,
              }}
            />
            <p className="text-sm opacity-75">The cost per box is {toTokens(contest.boxCost.amount, contest.boxCost.decimals)} {contest.boxCost.symbol} </p>
            <div className="divider">OR</div>
            <div className="text-4xl font-bold">Fund</div>
            <p className="mb-2">Fund your wallet to execute swaps</p>
            <FundButton />
            <div className="my-1" />
            <div className="text-4xl font-bold">Swap</div>
            <p className="mb-2">Swap to {contest.boxCost.symbol}</p>
            <SwapDefault
              from={DEFAULT_TOKENS}
              to={[{
                address: isAddressEqual(contest.boxCost.currency, zeroAddress) 
                  ? "" 
                  : contest.boxCost.currency,
                chainId: base.id,
                decimals: contest.boxCost.decimals,
                name: contest.boxCost.name,
                symbol: contest.boxCost.symbol,
                image: contest.boxCost.image,
              }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

