import { useMemo } from "react";
import { toUnits } from "thirdweb";
import { isAddress, isAddressEqual,zeroAddress } from "viem";

import { PAYOUTS } from "~/constants";
import { type Contest, type ScoresOnChain } from "~/types/contest";
import { type Game } from "~/types/game";

type Props = {
  col: number;
  row: number;
  contest: Contest;
  game: Game;
  scoresOnchain: ScoresOnChain;
  owner: string;
}
export const useBoxIsWinner = ({
  col, row, contest, game, scoresOnchain, owner
}: Props) => {
  const homeScore = contest.cols[col - 1];
  const awayScore = contest.rows[row - 1];

  const quarterCompletedLive = useMemo(() => {
    const liveQuarter = game.competitions?.[0]?.status?.period ?? 1;
    if (game.competitions?.[0]?.status?.type?.completed) return 100;
    return (liveQuarter - 1);
  }, [game]);
  
  const winningQuarters = useMemo(() => {
    return {
      q1: homeScore === scoresOnchain.homeQ1LastDigit && awayScore === scoresOnchain.awayQ1LastDigit && quarterCompletedLive >= 1,
      q2: homeScore === scoresOnchain.homeQ2LastDigit && awayScore === scoresOnchain.awayQ2LastDigit && quarterCompletedLive >= 2,
      q3: homeScore === scoresOnchain.homeQ3LastDigit && awayScore === scoresOnchain.awayQ3LastDigit && quarterCompletedLive >= 3,
      f: homeScore === scoresOnchain.homeFLastDigit && awayScore === scoresOnchain.awayFLastDigit && game.competitions?.[0]?.status?.type?.completed,
    }
  }, [
    homeScore, 
    scoresOnchain.homeQ1LastDigit, 
    scoresOnchain.awayQ1LastDigit, 
    scoresOnchain.homeQ2LastDigit, 
    scoresOnchain.awayQ2LastDigit, 
    scoresOnchain.homeQ3LastDigit, 
    scoresOnchain.awayQ3LastDigit, 
    scoresOnchain.homeFLastDigit, 
    scoresOnchain.awayFLastDigit, 
    awayScore, 
    quarterCompletedLive, 
    game.competitions
  ]);

  const hasWon = useMemo(() => {
    if (!contest.randomValuesSet || scoresOnchain.qComplete === 0) return false;
    // returns true if any of the winning quarters are true
    return Object.values(winningQuarters).some(Boolean);
  }, [contest.randomValuesSet, scoresOnchain.qComplete, winningQuarters]);

  const isYetToBePaid = useMemo(() => {
    if (winningQuarters.q1 && !contest.q1Paid) return true;
    if (winningQuarters.q2 && !contest.q2Paid) return true;
    if (winningQuarters.q3 && !contest.q3Paid) return true;
    if (winningQuarters.f && !contest.finalPaid) return true;
    return false;
  }, [winningQuarters, contest]);

  const isAbleToBePaid = useMemo(() => {
    if (!hasWon) return false;
    if (!isYetToBePaid) return false;
    if (winningQuarters.q1 && scoresOnchain.qComplete >= 1 && !contest.q1Paid) return true;
    if (winningQuarters.q2 && scoresOnchain.qComplete >= 2 && !contest.q2Paid) return true;
    if (winningQuarters.q3 && scoresOnchain.qComplete >= 3 && !contest.q3Paid) return true;
    if (winningQuarters.f && scoresOnchain.qComplete >= 4 && !contest.finalPaid) return true;
    return false;
  }, [hasWon, isYetToBePaid, winningQuarters.q1, winningQuarters.q2, winningQuarters.q3, winningQuarters.f, scoresOnchain.qComplete, contest.q1Paid, contest.q2Paid, contest.q3Paid, contest.finalPaid]);

  const pendingRewardAmount = useMemo(() => {
    if (!contest) return 0;
    if (!hasWon) return 0;
    const totalAmountInContest = Number(toUnits(contest.boxCost.amount.toString(), contest.boxCost.decimals)) * Number(contest.boxesClaimed);
    let pendingRewardAmount = 0;
    if (winningQuarters.q1 && !contest.q1Paid) {
      pendingRewardAmount += totalAmountInContest * PAYOUTS.q1;
    }
    if (winningQuarters.q2 && !contest.q2Paid) {
      pendingRewardAmount += totalAmountInContest * PAYOUTS.q2;
    }
    if (winningQuarters.q3 && !contest.q3Paid) {
      pendingRewardAmount += totalAmountInContest * PAYOUTS.q3;
    }
    if (winningQuarters.f && !contest.finalPaid) {
      pendingRewardAmount += totalAmountInContest * PAYOUTS.f;
    }
    if (isAddress(owner) && !isAddressEqual(owner, zeroAddress)) return pendingRewardAmount / 2;
    return pendingRewardAmount.toLocaleString([], {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }, [contest, hasWon, winningQuarters.f, winningQuarters.q1, winningQuarters.q2, winningQuarters.q3, owner]);

  console.log({ row, col, homeScore, scoresOnchain, awayScore, winningQuarters, hasWon, isYetToBePaid, isAbleToBePaid, pendingRewardAmount , boxId: `${col}-${row}`});


  return {
    winningQuarters,
    hasWon,
    isYetToBePaid,
    isAbleToBePaid,
    pendingRewardAmount,
  }
};