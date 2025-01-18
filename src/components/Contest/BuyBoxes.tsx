import { FundButton } from '@coinbase/onchainkit/fund';
import { type LifecycleStatus, Transaction, TransactionButton, TransactionToast, TransactionToastAction, TransactionToastIcon, TransactionToastLabel } from '@coinbase/onchainkit/transaction';
import { CheckIcon,DocumentDuplicateIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';
import Link from 'next/link';
import { type Call } from 'node_modules/@coinbase/onchainkit/esm/transaction/types';
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

    const buyQueryParams = new URLSearchParams({
        address: contest.boxCost.currency,
        decimals: contest.boxCost.decimals.toString(),
        name: contest.boxCost.name,
        symbol: contest.boxCost.symbol,
        image: contest.boxCost.image,
        contestId: contest.id.toString(),
    }).toString();

    return (
        <>
        {address && !hasEnoughBalance && selectedBoxes.length > 0 && (
            <div className="btm-nav h-1/2 bg-base-300 slide-up">
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
                <div className="text-center">You do not have enough {contest.boxCost.name ?? contest.boxCost.symbol} to claim these boxes.</div>
                <div className="stats shadow">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <Image
                        src={contest.boxCost.image}
                        alt={contest.boxCost.symbol}
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="stat-title">Your Balance</div>
                    <div className="stat-value">
                      {toTokens(balance, contest.boxCost.decimals)}
                    </div>
                    <div className="stat-desc">
                      ${contest.boxCost.symbol}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure">
                      <Image
                        src={contest.boxCost.image}
                        alt={contest.boxCost.symbol}
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="stat-title">Total Cost</div>
                    <div className="stat-value">
                      {toTokens(contest.boxCost.amount * BigInt(selectedBoxes.length), contest.boxCost.decimals)}
                    </div>
                    <div className="stat-desc">
                      ${contest.boxCost.symbol}
                    </div>
                  </div>
                </div>
                <div className="text-center flex flex-col gap-1 mt-2 w-full max-w-xs pb-20">
                  <Link href={`/fund?${buyQueryParams}`} className="btn btn-primary btn-block">
                    Buy ${contest.boxCost.symbol}
                  </Link>
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