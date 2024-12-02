import { type LifecycleStatus, Transaction, TransactionButton, TransactionToast, TransactionToastAction, TransactionToastIcon, TransactionToastLabel } from '@coinbase/onchainkit/transaction';
import { type FC,useCallback, useMemo } from "react";
import { createThirdwebClient, encode, getContract } from 'thirdweb';

import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from '~/constants/addresses';
import { env } from '~/env';
import { getThirdwebChain } from '~/helpers/getThirdwebChain';
import { claimReward } from '~/thirdweb/84532/0x7bbc05e8e8eada7845fa106dfd3fc41a159b90f5';
import { type Contest } from '~/types/contest';

type Props = {
  tokenId: number;
  contest: Contest;
  rewards: string;
  quarterIndex: number;
}
export const ClaimReward: FC<Props> = ({ contest, tokenId, rewards, quarterIndex }) => {
  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
    if (status.statusName === 'success') {
      // TODO: refetch contest
    }
  }, []);
  const callsCallback = useCallback(async () => {
    const client = createThirdwebClient({
      clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    });
    const contract = getContract({
      address: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
      client,
      chain: getThirdwebChain(DEFAULT_CHAIN),
    });
    const claimTx = claimReward({
      contract,
      tokenId: BigInt(tokenId),
      contestId: BigInt(contest.id),
    });
    const claimCall ={
      to: contract.address as `0x${string}`,
      data: await encode(claimTx),
      value: 0n,
    };
    return [claimCall];
  }, [contest.id, tokenId]);

  const isClaimed = useMemo(() => {
    const quarterPaidKey = quarterIndex === 3 ? 'finalPaid' : `q${quarterIndex + 1}Paid`;
    return Boolean(contest[quarterPaidKey as keyof Contest]);
  }, [quarterIndex, contest]);

  return (
    <Transaction
      chainId={DEFAULT_CHAIN.id}
      calls={callsCallback}
      onStatus={handleOnStatus}
    >
      <TransactionButton 
        disabled={isClaimed} 
        text={`Claim${isClaimed ? 'ed' : ''} ${rewards} ${contest.boxCost.symbol}`} 
      />
      <TransactionToast position="top-center">
        <TransactionToastIcon />
        <TransactionToastLabel />
        <TransactionToastAction />
      </TransactionToast>
    </Transaction>
  )
}