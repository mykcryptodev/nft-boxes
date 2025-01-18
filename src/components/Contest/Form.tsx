import { type Token } from "@coinbase/onchainkit/token";
import { type LifecycleStatus, Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import { watchContractEvent } from '@wagmi/core'
import { useRouter } from "next/router";
import { type Call } from "node_modules/@coinbase/onchainkit/esm/transaction/types";
import { type FC, useCallback, useEffect,useMemo, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { createThirdwebClient, encode, getContract, toUnits } from "thirdweb";
import { isAddress, isAddressEqual, zeroAddress } from "viem";
import { useAccount } from "wagmi";

import TokenPicker from "~/components/utils/TokenPicker";
import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { ETH_TOKEN } from "~/constants/tokens";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import { useWagmiStore } from "~/providers/OnchainProviders";
import { createContest } from "~/thirdweb/84532/0x7bbc05e8e8eada7845fa106dfd3fc41a159b90f5";
import { api } from "~/utils/api";

interface FormInput {
  gameId: string;
  season: number;
  week: number;
  boxCost: number;
  boxCurrency: string;
}

type SeasonMapT = Record<number, string>;

const SeasonMap = {
  [1]: "Preseason",
  [2]: "Regular Season",
  [3]: "Postseason",
} as SeasonMapT;

export const ContestForm: FC = () => {
  const router = useRouter();
  const { data: currentWeek } = api.game.getCurrentWeek.useQuery();
  const { data: currentSeason } = api.game.getCurrentSeason.useQuery();
  const { address } = useAccount();
  const { config } = useWagmiStore();
  const { register, handleSubmit, watch, reset } = useForm<FormInput>({
    defaultValues: {
      gameId: '',
      week: currentWeek?.week?.number ?? 1,
      season: currentSeason?.season?.type ?? 2, // default to regular season
      boxCost: 0,
    },
  });
  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
  }, []);
  const unwatch = watchContractEvent(config!, {
    address: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
    abi: [
      {
        name: 'ContestCreated',
        inputs: [
          {
            name: 'contestId',
            type: 'uint256',
            indexed: true,
          },
          {
            name: 'creator',
            type: 'address',
            indexed: true,
          }
        ],
        type: 'event',
      },
    ],
    eventName: 'ContestCreated',
    onLogs(logs) {
      console.log({ logs });
      if (
        logs[0]?.args.creator && 
        isAddress(logs[0].args.creator) && 
        isAddress(address ?? '') &&
        isAddressEqual(logs[0].args.creator, address ?? zeroAddress)
      ) {
        unwatch?.();
        const contestId = logs[0].args.contestId?.toString();
        if (contestId) {
          void router.push(`/contest/${contestId}`);
        }
      };
    },
    pollingInterval: 1_000, 
  });
  useEffect(() => {
    reset({
      gameId: '',
      week: currentWeek?.week?.number ?? 1,
      boxCost: 0,
      season: currentSeason?.season?.type ?? 2,
    });
  }, [currentSeason?.season?.type, currentWeek?.week?.number, reset]);
  const week = watch("week");
  const gameId = watch("gameId");
  const boxCost = watch("boxCost");
  const [boxCurrency, setBoxCurrency] = useState<Token>(ETH_TOKEN);
  const season = watch("season");
  const numWeeks = useMemo(() => {
    const weeksInRegularSeason = 18;
    const weeksInPreseason = 4;
    const weeksInPostseason = 5;
    switch (Number(season)) {
      case 1:
        return weeksInPreseason;
      case 2:
        return weeksInRegularSeason;
      case 3:
        return weeksInPostseason;
      default:
        return weeksInRegularSeason;
    }
  }, [season]);
  const { data: weekData, isLoading: isLoadingWeekData } = api.game.getByWeek.useQuery({
    week: Number(week),
    season: Number(season),
  });
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log({ data })
  };

  const handleTokenSelected = (token: Token) => {
    setBoxCurrency(token);
  }

  const callsCallback = async () => {
    const client = createThirdwebClient({
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    });
    const createContestCall = createContest({
      contract: getContract({
        chain: getThirdwebChain(DEFAULT_CHAIN),
        address: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
        client,
      }),
      gameId: BigInt(gameId),
      boxCost: BigInt(toUnits(boxCost.toString(), boxCurrency.decimals)),
      boxCurrency: boxCurrency.address,
    });

    return [{
      to: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
      data: await encode(createContestCall),
      value: BigInt(0),
    }];
  }

  return (
    <div className="flex justify-center w-full">
      <form onSubmit={void handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg capitalize">Season</span>
            </label>
            <div className="text-sm pb-2">
              Select a season to populate the weeks you can choose from
            </div>
            <select
              {...register("season")}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="">Select a season</option>
              {/* season options are 1 - 3 */}
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
              {[...Array(3)].map((_, i) => {
                return (
                  <option key={i} value={i + 1}>
                    {SeasonMap[i + 1]}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg capitalize">Week</span>
            </label>
            <div className="text-sm pb-2">
              Select a week to populate the games you can choose from
            </div>
            <select
              {...register("week")}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="">Select a week</option>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
              {[...Array(numWeeks)].map((_, i) => {
                return (
                  <option key={i} value={i + 1}>
                    Week {i + 1}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg capitalize">Game</span>
            </label>
            <div className="text-sm pb-2">
              This is the game that your boxes are based on
            </div>
            <select
              {...register("gameId")}
              disabled={isLoadingWeekData}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="">Select a game</option>
              {weekData?.events?.map((game) => {
                const homeTeam = game.competitions[0]?.competitors.find(
                  (competitor) => competitor.homeAway === 'home'
                )?.team.name;
                const awayTeam = game.competitions[0]?.competitors.find(
                  (competitor) => competitor.homeAway === 'away'
                )?.team.name;
                const gameTime = new Date(game.date).toLocaleDateString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                });
                return (
                  <option key={game.id} value={game.id}>
                    {awayTeam ?? "Away Team"} @ {homeTeam ?? "Home Team"}: {gameTime}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-lg capitalize">Box Cost</span>
            </label>
            <div className="text-sm pb-2">
              Set the price per-box for your contest
            </div>
            <div className="join">
              <input
                {...register("boxCost")}
                type="number"
                className="input input-bordered w-full max-w-xs join-item text-right pr-12"
              />
              <div className="join-item input input-bordered p-4 flex items-center gap-2 place-content-center">
                <TokenPicker id="boxCurrency" onTokenSelected={handleTokenSelected} selectedToken={boxCurrency} />
              </div>
            </div>
            {/* {true && (
              <label className="label text-opacity-50">
                <span></span>
                <span className="label-text capitalize">
                  ~$costUsd
                </span>
              </label>
            )} */}
          </div>
          <Transaction
            chainId={DEFAULT_CHAIN.id}
            calls={callsCallback as unknown as Call[]}
            onStatus={handleOnStatus}
          >
            <TransactionButton text="Create Contest" />
          </Transaction>
        </div>
      </form>
    </div>
  );
};

export default ContestForm;