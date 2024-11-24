import { useName } from "@coinbase/onchainkit/identity";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { type FC,useCallback,useEffect,useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";
import { zeroAddress } from "viem";
import { base } from "viem/chains";
import { useAccount } from "wagmi";

import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_READER_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import useContest from "~/hooks/useContest";
import { fetchAllContestsWithUser } from "~/thirdweb/84532/0x534dc0b2ac842d411d1e15c6b794c1ecea9170c7";
import { type Contest } from "~/types/contest";
import { api } from "~/utils/api";

import IdentityOptions from "./Options";

const IdentityForm = dynamic(() => import("./Form"), { ssr: false });

type Props = {
  contest: Contest;
}
export const RequestIdentity: FC<Props> = ({ contest }) => {
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleIsOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const [isUserInContest, setIsUserInContest] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data: name, isLoading: isNameLoading } = useName({ address: address ?? zeroAddress, chain: base });
  const { data: localProfile, isLoading: isLocalProfileLoading } = api.user.getIdentity.useQuery({
    address: address ?? "",
  });
  const [isSettingIdentity, setIsSettingIdentity] = useState<boolean>(false);
  const { refetch } = useContest(contest.id.toString());


  useEffect(() => {
    if (!address) return;
    const getContestsWithUser = async () => {
      const client = createThirdwebClient({
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      });
      const contests = await fetchAllContestsWithUser({
        contract: getContract({
          address: CONTEST_READER_CONTRACT[DEFAULT_CHAIN.id]!,
          client,
          chain: getThirdwebChain(DEFAULT_CHAIN),
        }),
        user: address,
      });
      setIsUserInContest(contests.some((c) => c === contest.id));
    }
    void getContestsWithUser();
  }, [contest.id, address]);

  useEffect(() => {
    if (isLocalProfileLoading || isNameLoading) return;
    if (isUserInContest && !name && !localProfile?.name) {
      setIsOpen(true);
    }
  }, [isUserInContest, name, isLocalProfileLoading, isNameLoading, localProfile?.name]);
  
  return (
    <>
      <input type="checkbox" id="identity_modal" className="modal-toggle" checked={isOpen} />
      <div className="modal" role="dialog">
        <div className="modal-box relative">
          <label htmlFor="identity_modal" className="btn btn-circle btn-ghost btn-sm absolute right-4 top-4" onClick={toggleIsOpen}>
            <XMarkIcon className="w-4 h-4 stroke-2" />
          </label>
          {isSettingIdentity && (
            <button className="btn btn-ghost btn-sm" onClick={() => setIsSettingIdentity(false)}>
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </button>
          )}
          {isSettingIdentity ? (
            <IdentityForm onIdentitySet={() => {
              void refetch();
              toggleIsOpen();
            }}/>
          ) : (
            <IdentityOptions onSetIdentity={() => setIsSettingIdentity(true)} />
          )}
          <div className="modal-action" />
        </div>
      </div>
    </>
  )
}

export default RequestIdentity;