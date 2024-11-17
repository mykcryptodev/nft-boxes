import { FundButton } from "@coinbase/onchainkit/fund";
import { SwapDefault } from "@coinbase/onchainkit/swap";
import { GetServerSideProps, type NextPage } from "next";
import { DEFAULT_TOKENS } from "~/constants/tokens";
import { base } from "viem/chains";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
        <div className="text-4xl font-bold mb-2">Fund</div>
        <FundButton />
        <div className="divider" />
        <div className="text-4xl font-bold mb-2">Swap</div>
        <SwapDefault
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