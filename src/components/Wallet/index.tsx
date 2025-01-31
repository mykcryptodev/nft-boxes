import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import {
  ConnectWallet,
  Wallet as WalletComponent,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownFundLink,
} from '@coinbase/onchainkit/wallet';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { type FC, useEffect, useState } from 'react';
import { Blobbie } from "thirdweb/react";
import { shortenAddress } from 'thirdweb/utils';
import { useAccount } from "wagmi";

import { api } from '~/utils/api';

type Props = {
  btnLabel?: string;
}
export function Wallet({ btnLabel }: Props) {
  const { isDisconnected, address } = useAccount();
  const { data: sessionData } = useSession();
  const { data: identity } = api.identity.getOrFetchIdentity.useQuery({
    address: address ?? ''
  }, {
    enabled: !!address,
  });

  useEffect(() => {
    // if the user was signed in but is not disconnected, sign them out
    if (sessionData && isDisconnected) {
      void signOut();
    }
  }, [isDisconnected, sessionData]);

  const WalletAvatar: FC = () => {
    console.log({ walletAvatar: true, identity, address})
    const [isError, setIsError] = useState(false);
   
    return (
      isError ? (
        <Blobbie address={address ?? ""} className="w-full h-full" />
      ) : (
        <Image
          src={identity?.image ?? ''}
          alt={identity?.name ?? shortenAddress(address ?? "")}
          width={48}
          height={48}
          onError={() => setIsError(true)}
        />
      )
    )
  }

  const WalletName: FC = () => {
    return (
      identity?.name ? (
        <span className="font-bold text-lg">{identity?.name ?? shortenAddress(address ?? "")}</span>
      ) : (
        <Name />
      )
    )
  }

  return (
    <div className="flex gap-2 items-center">
      <WalletComponent>
        <ConnectWallet text={btnLabel}>
          <Avatar className="h-6 w-6" defaultComponent={
            <WalletAvatar />
          } />
          <WalletName />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <WalletAvatar />
            <WalletName />
            <Address className={color.foregroundMuted} />
            <EthBalance />
          </Identity>
          <WalletDropdownBasename />
          <WalletDropdownFundLink />
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </WalletComponent>
    </div>
  );
}
