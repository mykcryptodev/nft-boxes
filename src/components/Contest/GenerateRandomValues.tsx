import { type LifecycleStatus, Transaction, TransactionButton } from "@coinbase/onchainkit/transaction";
import { type FC,useCallback } from "react";
import { createThirdwebClient, encode, getContract } from "thirdweb";
import { useReadContract } from "wagmi";

import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import { fetchRandomValues } from "~/thirdweb/84532/0xb9647d7982cefb104d332ba818b8971d76e7fa1f";
import { type Contest } from "~/types/contest";

type Props = {
  contest: Contest;
  onValuesGenerated: () => void;
}

export const GenerateRandomValues: FC<Props> = ({ contest, onValuesGenerated }) => {
  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    if (status.statusName === 'success') {
      onValuesGenerated();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data: vrfFee }: { data: bigint | undefined } = useReadContract({
    address: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
    abi: [
      {
        name: 'vrfFee',
        type: 'function',
        inputs: [],
        outputs: [{ type: 'uint256' }],
      },
    ],
    functionName: 'vrfFee',
  });

  const callsCallback = async () => {
    if (!vrfFee) {
      return [];
    }
    const client = createThirdwebClient({
      clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    });
    const contract = getContract({
      address: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
      client,
      chain: getThirdwebChain(DEFAULT_CHAIN),
    });
    const data = fetchRandomValues({
      contract,
      contestId: contest.id,
    });
    return [{
      to: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
      data: await encode(data),
      value: BigInt(vrfFee),
    }];
  };

  if (contest.randomValuesSet) {
    return null;
  }

  return (
    <>
      <button className="btn btn-block" onClick={()=> {
        const modal = document?.getElementById('random_generator_modal') as HTMLDialogElement;
        modal.showModal();
      }}>
        Generate Random Row/Col Values
      </button>
      <dialog id="random_generator_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <form method="dialog" className="absolute top-4 right-4">
            <button className="btn btn-sm btn-ghost btn-circle">&times;</button>
          </form>
          <h3 className="font-bold text-lg">Generate Random Row/Col Values</h3>
          <p className="py-4">
            Generating random values for rows and columns will prevent any further boxes from being claimed.
          </p>
          {contest.boxesClaimed !== 100n && (
            <p className="p-4 bg-warning text-sm text-warning-content rounded-lg">
              <strong>Nobody will be able to claim new boxes after this action is taken.</strong>
            </p>
          )}
          <div className="modal-action">
            <Transaction
              calls={callsCallback}
              onStatus={handleOnStatus}
            >
              <TransactionButton disabled={!vrfFee} text="Generate Random Values" />
            </Transaction>
          </div>
        </div>
      </dialog>
    </>
  )
};

export default GenerateRandomValues;