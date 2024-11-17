import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { type FC } from "react";

import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { useBoxOwner } from "~/hooks/useBoxOwner";
import { type Contest,type ScoresOnChain } from "~/types/contest";
import { type Game } from "~/types/game";

import { ClaimReward } from "./ClaimReward";
import { toTokens } from "thirdweb";

type Props = {
  game: Game;
  contest: Contest;
  scoresOnchain: ScoresOnChain;
}
export const Winners: FC<Props> = ({ game, contest, scoresOnchain }) => {
  console.log({ scoresOnchain, contest})
  // Helper function to get winning box for a quarter
  const getQuarterWinningTokenId = (quarterIndex: number) => {
    if (!scoresOnchain || !contest.rows || !contest.cols) return null;
    if (scoresOnchain.qComplete < quarterIndex + 1) return null;
    const quarterKey = quarterIndex === 3 ? 'F' : `Q${quarterIndex + 1}`;
    const homeDigitKey = `home${quarterKey}LastDigit`;
    const awayDigitKey = `away${quarterKey}LastDigit`;
    const homeDigit = scoresOnchain[homeDigitKey as keyof ScoresOnChain];
    const awayDigit = scoresOnchain[awayDigitKey as keyof ScoresOnChain];
    const winningRow = contest.rows.findIndex(row => row === Number(awayDigit));
    const winningCol = contest.cols.findIndex(col => col === Number(homeDigit));
    // now that we know the winning row and col, we can return the box id
    const boxId = (winningRow * 10 + winningCol) + (Number(contest.id) * 100);

    return boxId;
  };

  const getRewardsForQuarter = (quarterIndex: number) => {
    const payouts = {
      0: 0.15,
      1: 0.30,
      2: 0.15,
      3: 0.38,
    }
    const totalRewards = Number(contest.totalRewards);
    const rewardsForQuarter = totalRewards * payouts[quarterIndex as keyof typeof payouts];
    const formattedRewards = toTokens(BigInt(rewardsForQuarter), contest.boxCost.decimals);
    return formattedRewards;
  }

  const Winner: FC<{ tokenId: number, rewards: string, quarterIndex: number }> = ({ tokenId, rewards, quarterIndex }) => {
    const { owner } = useBoxOwner(contest.boxesAddress, tokenId);
    return (
      <div className="flex items-center justify-center">
        {owner && owner !== CONTEST_CONTRACT[DEFAULT_CHAIN.id] ? (
          <div className="flex flex-col gap-1 items-center justify-center">
            <Avatar className="w-12 h-12" address={owner} />
            <Name address={owner} />
            <ClaimReward 
              contest={contest} 
              tokenId={tokenId} 
              rewards={rewards} 
              quarterIndex={quarterIndex}
            />
          </div>
        ) : null}
      </div>
    )
  }
  
  return (
    <div className={`grid grid-cols-2 grid-rows-2 gap-2 place-items-center`}>
      {Array.from({ length: 4 }).map((_, index) => {
        const winningTokenId = getQuarterWinningTokenId(index);
        
        return (
          <div key={index} className="rounded-3xl w-full h-full p-px bg-gradient-to-b from-primary to-secondary">
            <div className="bg-base-200 h-full min-h-32 p-4 flex flex-col justify-center rounded-[calc(1.5rem-1px)]">
              <p className="text-start text-lg">
                {index === 3 ? "Final" : `Q${index + 1}`}
              </p>
              {winningTokenId ? (
                <Winner tokenId={winningTokenId} rewards={getRewardsForQuarter(index)} quarterIndex={index} />
              ) : (
                <div className="flex flex-col gap-1 items-center justify-center">
                  <div className="w-12 h-12 bg-base-300 rounded-full flex items-center justify-center" />
                  <p className="text-lg">TBD</p>
                  <button className="btn btn-primary btn-disabled">
                    Claim {getRewardsForQuarter(index)} {contest.boxCost.symbol}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
