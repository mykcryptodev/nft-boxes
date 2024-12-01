import { FundButton } from '@coinbase/onchainkit/fund';
import { type LifecycleStatus, Transaction, TransactionButton, TransactionToast, TransactionToastAction, TransactionToastIcon, TransactionToastLabel } from '@coinbase/onchainkit/transaction';
import { CheckIcon,DocumentDuplicateIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Call } from 'node_modules/@coinbase/onchainkit/esm/transaction/types';
import { type FC,useCallback,useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createThirdwebClient, encode, getContract, toTokens } from 'thirdweb';
import { approve } from 'thirdweb/extensions/erc20';
import { getWalletBalance } from "thirdweb/wallets";
import { isAddressEqual, zeroAddress } from 'viem';
import { useAccount } from "wagmi";

import { DEFAULT_CHAIN } from '~/constants';
import { CONTEST_CONTRACT } from '~/constants/addresses';
import { env } from '~/env';
import { getThirdwebChain } from '~/helpers/getThirdwebChain';
import { claimBoxes } from '~/thirdweb/84532/0x7bbc05e8e8eada7845fa106dfd3fc41a159b90f5';
import { type Contest } from "~/types/contest";

type Props = {
    contest: Contest;
    selectedBoxes: number[];
    setSelectedBoxes: (boxes: number[]) => void;
    onBoxBuySuccess: () => void;
}

export const BuyBoxes: FC<Props> = ({ contest, selectedBoxes, setSelectedBoxes, onBoxBuySuccess }) => {
    const { address } = useAccount();
    const [balance, setBalance] = useState<bigint>(0n);
    const handleOnStatus = useCallback((status: LifecycleStatus) => {
        console.log('LifecycleStatus', status);
        if (status.statusName === 'success') {
            void onBoxBuySuccess();
        }
    }, [onBoxBuySuccess]);

    const totalAmount = useMemo(() => toTokens(
      contest.boxCost.amount * BigInt(selectedBoxes.length),
      contest.boxCost.decimals
    ), [contest.boxCost.amount, contest.boxCost.decimals, selectedBoxes.length]);

    const callsCallback = useCallback(async () => {
        if (!address) return [];
        const client = createThirdwebClient({
            clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
        });
        const contract = getContract({
            address: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
            client,
            chain: getThirdwebChain(DEFAULT_CHAIN),
        });
        const data = claimBoxes({
            contract,
            player: address,
            tokenIds: selectedBoxes.map(BigInt),
        });
        const buyCall = {
            to: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
            data: await encode(data),
            value: isAddressEqual(contest.boxCost.currency, zeroAddress) ? contest.boxCost.amount * BigInt(selectedBoxes.length) : 0n,
        };
        if (isAddressEqual(contest.boxCost.currency, zeroAddress)) {
            return [buyCall];
        }
        const tokenContract = getContract({
            address: contest.boxCost.currency,
            client,
            chain: getThirdwebChain(DEFAULT_CHAIN),
        });
        const allowance = approve({
            contract: tokenContract,
            spender: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
            amount: totalAmount,
        });
        const allowanceCall = {
            to: contest.boxCost.currency,
            data: await encode(allowance),
            value: 0n,
        };
        return [allowanceCall, buyCall];
    }, [address, contest.boxCost.amount, contest.boxCost.currency, selectedBoxes, totalAmount]);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!contest.boxesAddress) return;
            if (!address) return;
            const client = createThirdwebClient({
                clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
            });
            const result = await getWalletBalance({
                address,
                client,
                chain: getThirdwebChain(DEFAULT_CHAIN),
                tokenAddress: isAddressEqual(contest.boxCost.currency, zeroAddress) 
                    ? undefined 
                    : contest.boxCost.currency,
            });
            setBalance(result.value);
        };
        void fetchBalance();
    }, [address, contest.boxCost.currency, contest.boxesAddress]);

    const hasEnoughBalance = balance >= contest.boxCost.amount * BigInt(selectedBoxes.length);
    return (
        <>
        {address && !hasEnoughBalance && selectedBoxes.length > 0 && (
            <div className="btm-nav sm:h-2/6 h-1/2 bg-base-300 slide-up">
              <div className="flex flex-col gap-2">
                <div className="flex justify-end w-full max-w-sm">
                  <button
                    className="btn btn-ghost btn-circle btn-sm p-2"
                    onClick={() => {
                      setSelectedBoxes([]);
                    }}
                  >
                    <XMarkIcon className="w-4 h-4 stroke-2" />
                  </button>
                </div>
                <div>You do not have enough CURRENCY to claim these boxes.</div>
                <div className="stats shadow">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      Token Image
                    </div>
                    <div className="stat-title">Your Balance</div>
                    <div className="stat-value">
                      User Balance
                    </div>
                    <div className="stat-desc">
                      CURRENCY NAME
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure">
                      Token Image
                    </div>
                    <div className="stat-title">Total Cost</div>
                    <div className="stat-value">
                      TOTAL COST
                    </div>
                    <div className="stat-desc">
                      SYMBOL
                    </div>
                  </div>
                </div>
                <div className="text-center flex flex-col gap-1 mt-4">
                  <div>Buy CURRENCY with</div>
                  <div className="flex w-full justify-center items-center gap-2">
                    <FundButton />
                  </div>
                  <div className="text-xs">
                    When you buy CURRENCY, make sure to send it to the following address:
                  </div>
                  <div className="text-xs flex items-center gap-1">
                    <code>{address}</code>
                    <label className="swap swap-rotate">
                      <input 
                        id="copy-address-main"
                        type="checkbox"                   
                        onClick={() => {
                          void navigator.clipboard.writeText(address ?? "");
                          toast.success("Wallet address copied!");
                          // wait 5 seconds then switch the checkbox back
                          setTimeout(() => {
                            const checkbox = document.getElementById('copy-address-main') as HTMLInputElement;
                            checkbox.checked = false;
                          }, 5000);
                        }}
                      />
                      <DocumentDuplicateIcon className="swap-off w-4 h-4 stroke-2" />
                      <CheckIcon className="swap-on w-4 h-4 stroke-2" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
        )}
        {address && hasEnoughBalance && selectedBoxes.length > 0 && (
            <>
            <div className="h-20" />
            <div className="btm-nav p-4 mx-auto max-w-3xl">
                <Transaction
                    chainId={DEFAULT_CHAIN.id}
                    calls={callsCallback as unknown as Call[]}
                    onStatus={handleOnStatus}
                >
                    <TransactionButton text={`Buy ${selectedBoxes.length} Boxes (${totalAmount} ${contest.boxCost.symbol})`} />
                    <TransactionToast position="top-center">
                        <TransactionToastIcon />
                        <TransactionToastLabel />
                        <TransactionToastAction />
                    </TransactionToast>
                </Transaction>
            </div>
            </>
        )}
        </>
    )
}