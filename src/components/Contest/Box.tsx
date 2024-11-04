import { Avatar } from "@coinbase/onchainkit/identity";
import React, { useEffect, useMemo, useState } from "react";
import { type FC } from "react";
import { createThirdwebClient, getContract } from "thirdweb";
import { ownerOf } from "thirdweb/extensions/erc721";
import { type Address } from "viem";
import { isAddress, isAddressEqual } from "viem";

import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";

type Props = {
    boxesAddress: string;
    boxId: number;
    onBoxSelected: (boxId: number) => void;
    onBoxUnselected: (boxId: number) => void;
    selectedBoxIds: number[];
}
export const Box: FC<Props> = ({ boxesAddress, boxId, onBoxSelected, onBoxUnselected, selectedBoxIds }) => {
    const [owner, setOwner] = useState<string>("");
    const boxIsUnclaimed = useMemo(() => {
        return isAddress(owner) && isAddressEqual(owner, CONTEST_CONTRACT[DEFAULT_CHAIN.id]!);
    }, [owner]);

    useEffect(() => {
        const getOwner = async () => {
            const client = createThirdwebClient({
                clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
            });
            const contract = getContract({
                client,
                address: boxesAddress,
                chain: getThirdwebChain(DEFAULT_CHAIN),
            });
            const result = await ownerOf({
                contract,
                tokenId: BigInt(boxId),
            });
            console.log({result});
            setOwner(result);
        }
        void getOwner();
    }, [boxesAddress, boxId]);

    if (boxIsUnclaimed) {
        return (
            <div className="h-full w-full bg-base-300 rounded-lg flex items-center justify-center">
                <input 
                    type="checkbox" 
                    className="checkbox" 
                    onChange={() => {
                        if (selectedBoxIds.includes(boxId)) {
                            onBoxUnselected(boxId);
                        } else {
                            onBoxSelected(boxId);
                        }
                    }}
                    checked={selectedBoxIds.includes(boxId)}
                />
            </div>
        )
    }

    return (
        <div className="h-full w-full bg-base-300 rounded-lg flex items-center justify-center">
            {owner ? (<Avatar className="w-6 h-6" address={owner as Address} />) : boxId}
        </div>
    )
}

export default Box;