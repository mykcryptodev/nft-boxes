import { Buy } from "@coinbase/onchainkit/buy";
import { FundButton } from "@coinbase/onchainkit/fund";
import { SwapDefault } from "@coinbase/onchainkit/swap";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { type GetServerSideProps, type NextPage } from "next";
import Link from "next/link";
import { base } from "viem/chains";

import { DEFAULT_TOKENS } from "~/constants/tokens";

type Props = {
  address: `0x${string}`;
  decimals: number;
  name: string;
  symbol: string;
  image: string;
  contestId: string;
};

export const Fund: NextPage<Props> = ({ address, decimals, name, symbol, image, contestId }) => {
  return (
    <div>
      <Link href={`/contest/${contestId}`} className="text-lg font-bold mb-2 flex items-center gap-2">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Contest
      </Link>
      <div className={`my-8 p-4 flex flex-col gap-2 items-center justify-center`}>
        <div className="text-4xl font-bold">Buy</div>
        <p className="mb-2 text-center text-sm">Buy with services like Coinbase and Apple Pay</p>
        <Buy
          toToken={{
            address,
            chainId: base.id,
            decimals,
            name,
            symbol,
            image,
          }}
        />
        <div className="divider">OR</div>
        <div className="text-4xl font-bold">Fund</div>
        <p className="mb-2 text-center text-sm">Fund your wallet to execute swaps</p>
        <FundButton />
        <div className="mb-2" />
        <div className="text-4xl font-bold">Swap</div>
        <p className="mb-2 text-center text-sm">Swap to {symbol}</p>
        <SwapDefault
          className="sm:max-w-full max-w-[300px]"
          from={DEFAULT_TOKENS}
          to={[{
            address,
            chainId: base.id,
            decimals,
            name,
            symbol,
            image,
          }]}
        />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address, decimals, name, symbol, image, contestId } = context.query;
  return { props: { address, decimals, name, symbol, image, contestId } };
};

export default Fund;