import { type LifecycleStatus, Transaction, TransactionButton } from "@coinbase/onchainkit/transaction";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Call } from "node_modules/@coinbase/onchainkit/esm/transaction/types";
import { type FC,useCallback } from "react";
import { createThirdwebClient, encode, getContract } from "thirdweb";

import { Portal } from "~/components/utils/Portal";
import { CHAINLINK_GAS_LIMIT, CHAINLINK_JOB_ID, CHAINLINK_SUBSCRIPTION_ID, DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import { fetchFreshGameScores } from "~/thirdweb/84532/0x7bbc05e8e8eada7845fa106dfd3fc41a159b90f5";

export const RefreshOnchainScores: FC<{ gameId: string }> = ({ gameId }) => {
    const handleOnStatus = useCallback((status: LifecycleStatus) => {
        console.log('LifecycleStatus', status);
    }, []);

    const callsCallback = async () => {
        const client = createThirdwebClient({
            clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
        });
        const contract = getContract({
            address: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
            client,
            chain: getThirdwebChain(DEFAULT_CHAIN),
        });
        const data = fetchFreshGameScores({
            contract,
            gameId: BigInt(gameId),
            args: [gameId],
            subscriptionId: CHAINLINK_SUBSCRIPTION_ID[DEFAULT_CHAIN.id]!,
            gasLimit: CHAINLINK_GAS_LIMIT,
            jobId: CHAINLINK_JOB_ID[DEFAULT_CHAIN.id]!,
        });
        return [{
            to: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
            data: await encode(data),
            value: BigInt(0),
        }];
    }
  return (
    <>
    <label htmlFor={`refresh-onchain-scores-modal`} className="cursor-pointer">
      <div className="tooltip tooltip-right" data-tip="Sync Scores Onchain">      
        <ArrowPathIcon className="w-4 h-4 stroke-2" />
      </div>
    </label>

    <Portal>
      <input type="checkbox" id={`refresh-onchain-scores-modal`} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box flex flex-col gap-2 bg-base-100">
          <h3 className="text-lg font-bold">Sync Scores Onchain</h3>
          <p className="mb-4">Kick off the process to refresh the onchain scores for this game.</p>
            <Transaction
                className="btn btn-ghost btn-xs btn-circle"
                chainId={DEFAULT_CHAIN.id}
                calls={callsCallback as unknown as Call[]}
                onStatus={handleOnStatus}
            >
                <TransactionButton text="Sync Scores Onchain" />
            </Transaction>
        </div>
        <label className="modal-backdrop" htmlFor={`refresh-onchain-scores-modal`}>Close</label>
      </div>
    </Portal>
  </>

  );
};