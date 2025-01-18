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
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Blobbie } from "thirdweb/react";
import { useAccount } from "wagmi";

type Props = {
  btnLabel?: string;
}
export function Wallet({ btnLabel }: Props) {
  const { isDisconnected, address } = useAccount();
  const { data: sessionData } = useSession();

  useEffect(() => {
    // if the user was signed in but is not disconnected, sign them out
    if (sessionData && isDisconnected) {
      void signOut();
    }
  }, [isDisconnected, sessionData]);

  return (
    <div className="flex gap-2 items-center">
      <WalletComponent>
        <ConnectWallet text={btnLabel}>
          <Avatar className="h-6 w-6" defaultComponent={
            <Blobbie address={address ?? ""} className="w-full h-full" />
          } />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar 
              defaultComponent={
                <Blobbie address={address ?? ""} className="w-full h-full" />
              }
            />
            <Name />
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
