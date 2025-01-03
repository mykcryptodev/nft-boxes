import { OnchainKitProvider } from '@coinbase/onchainkit';
import sdk, { type FrameContext } from '@farcaster/frame-sdk';
import { type FC, useEffect, useState } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';
import { createConfig, http,WagmiProvider } from 'wagmi';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

import { APP_NAME, DEFAULT_CHAIN, EAS_SCHEMA_ID, SUPPORTED_CHAINS } from '~/constants';
import { env } from '~/env';
import { frameConnector } from "~/lib/frameConnector";

import '@coinbase/onchainkit/styles.css';

// make an object where each key is a chain id and the value is http() transport
// TODO: make these rpcs non public
const transports = SUPPORTED_CHAINS.reduce<Record<number, ReturnType<typeof http>>>((acc, chain) => {
  acc[chain.id] = http(`https://${chain.id}.rpc.thirdweb.com/${env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`);
  return acc;
}, {});

export const wagmiConfig = createConfig({
  chains: [DEFAULT_CHAIN],
  connectors: [
    coinbaseWallet({
      appName: APP_NAME,
      appLogoUrl: "/images/logo.png",
    }),
    metaMask({
      dappMetadata: {
        name: APP_NAME,
      },
    }),
    walletConnect({
      projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
    }),
    frameConnector(),
  ],
  ssr: true,
  transports,
  syncConnectedChain: true,
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
    <ThirdwebProvider>
      <WagmiProvider config={wagmiConfig}>
        <OnchainKitProvider
          apiKey={env.NEXT_PUBLIC_CDP_API_KEY}
          chain={DEFAULT_CHAIN}
          schemaId={EAS_SCHEMA_ID}
          config={{
            appearance: {
              name: APP_NAME,
              logo: "/images/logo.png",
              mode: "auto",
              theme: "default",
            }
          }}
        >
          {children}
        </OnchainKitProvider>
      </WagmiProvider>
    </ThirdwebProvider>
  );
} 
 
export default OnchainProviders;