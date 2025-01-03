import { OnchainKitProvider } from '@coinbase/onchainkit';
import sdk, { type FrameContext } from '@farcaster/frame-sdk';
import {
  connectorsForWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type FC, useEffect, useState } from 'react';
import { createConfig, http,WagmiProvider } from 'wagmi';

import { APP_NAME, DEFAULT_CHAIN, EAS_SCHEMA_ID, SUPPORTED_CHAINS } from '~/constants';
import { env } from '~/env';
import { frameConnector } from "~/lib/frameConnector";

import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();
 
const connectors = connectorsForWallets( 
  [
    {
      groupName: 'Recommended Wallet',
      wallets: [coinbaseWallet],
    },
    {
      groupName: 'Other Wallets',
      wallets: [
        rainbowWallet, 
        metaMaskWallet, 
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: APP_NAME,
    projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  },
);

// make an object where each key is a chain id and the value is http() transport
// TODO: make these rpcs non public
const transports = SUPPORTED_CHAINS.reduce<Record<number, ReturnType<typeof http>>>((acc, chain) => {
  acc[chain.id] = http(`https://${chain.id}.rpc.thirdweb.com/${env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`);
  return acc;
}, {});

export const wagmiConfig = createConfig({
  connectors: [...connectors, frameConnector()],
  chains: SUPPORTED_CHAINS,
  syncConnectedChain: true,
  transports,
});

type Props = {
  children: React.ReactNode;
}

const OnchainProviders: FC<Props> = ({ children }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isFrameLoaded, setIsFrameLoaded] = useState<boolean>(false);
  const [frameContext, setFrameContext] = useState<FrameContext>();
  console.log({ frameContext });

  useEffect(() => {
    const load = async () => {
      setFrameContext(await sdk.context);
      await sdk.actions.ready();
    };
    if (sdk && !isFrameLoaded) {
      setIsFrameLoaded(true);
      void load();
    }
  }, [isFrameLoaded]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isFrameLoaded) {
    return null;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={env.NEXT_PUBLIC_CDP_API_KEY}
          chain={DEFAULT_CHAIN}
          schemaId={EAS_SCHEMA_ID}
        >
          <RainbowKitProvider modalSize="compact">
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 
 
export default OnchainProviders;