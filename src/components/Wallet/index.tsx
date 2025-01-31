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
import { type FC, memo, useCallback, useEffect, useRef } from 'react';
import { Blobbie } from "thirdweb/react";
import { shortenAddress } from 'thirdweb/utils';
import { useAccount } from "wagmi";

import { api } from '~/utils/api';

const WalletAvatar: FC<{ address: string | undefined; image: string | null | undefined }> = memo(({ address, image }) => {
  if (!image) {
    return <Blobbie address={address ?? ""} className="w-full h-full" />;
  }
  
  return (
    <Image
      src={image}
      alt={shortenAddress(address ?? "")}
      width={48}
      height={48}
      onError={() => null}
    />
  );
});

WalletAvatar.displayName = 'WalletAvatar';

const WalletName: FC<{ address: string | undefined; name: string | null | undefined }> = memo(({ name }) => {
  if (name) {
    return <span className="font-bold text-lg">{name}</span>;
  }
  return <Name />;
});

WalletName.displayName = 'WalletName';

type Props = {
  btnLabel?: string;
}

export function Wallet({ btnLabel }: Props) {
  const { isDisconnected, address } = useAccount();
  const { data: sessionData, status } = useSession();
  const prevDisconnectedRef = useRef(isDisconnected);
  const { data: identity } = api.identity.getOrFetchIdentity.useQuery(
    {
      address: address ?? ''
    },
    {
      enabled: !!address && status === 'authenticated',
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      retry: false,
      staleTime: Infinity,
    }
  );

  const handleDisconnect = useCallback(async () => {
    if (sessionData?.user) {
      await signOut();
    }
  }, [sessionData?.user]);

  useEffect(() => {
    if (isDisconnected !== prevDisconnectedRef.current) {
      prevDisconnectedRef.current = isDisconnected;
      if (isDisconnected) {
        void handleDisconnect();
      }
    }
  }, [isDisconnected, handleDisconnect]);

  return (
    <div className="flex gap-2 items-center">
      <WalletComponent>
        <ConnectWallet text={btnLabel}>
          <Avatar className="h-6 w-6" defaultComponent={
            <WalletAvatar address={address} image={identity?.image} />
          } />
          <WalletName address={address} name={identity?.name} />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <WalletAvatar address={address} image={identity?.image} />
            <WalletName address={address} name={identity?.name} />
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
