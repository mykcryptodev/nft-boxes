import { OnchainKitProvider } from '@coinbase/onchainkit';
import sdk, { type FrameContext } from '@farcaster/frame-sdk';
import { type FC, useEffect, useState } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';
import { type Config, createConfig, http, WagmiProvider } from 'wagmi';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';
import { create } from 'zustand';

import { APP_NAME, DEFAULT_CHAIN, EAS_SCHEMA_ID, SUPPORTED_CHAINS } from '~/constants';
import { env } from '~/env';
import { frameConnector } from "~/lib/frameConnector";

import '@coinbase/onchainkit/styles.css';

// make an object where each key is a chain id and the value is http() transport
const transports = SUPPORTED_CHAINS.reduce<Record<number, ReturnType<typeof http>>>((acc, chain) => {
  acc[chain.id] = http(`https://${chain.id}.rpc.thirdweb.com/${env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`);
  return acc;
}, {});

const defaultConnectors = [
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
];

interface WagmiStore {
  config: Config | null;
  setConfig: (config: Config) => void;
}

export const useWagmiStore = create<WagmiStore>((set) => ({
  config: createConfig({
    chains: [DEFAULT_CHAIN],
    connectors: defaultConnectors,
    ssr: true,
    transports,
    syncConnectedChain: true,
  }),
  setConfig: (config) => set({ config }),
}));

type Props = {
  children: React.ReactNode;
}

const OnchainProviders: FC<Props> = ({ children }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isFrameLoaded, setIsFrameLoaded] = useState<boolean>(false);
  const [, setFrameContext] = useState<FrameContext>();
  const { setConfig } = useWagmiStore();
  const { config } = useWagmiStore();

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setFrameContext(context);
      await sdk.actions.ready();
      
      // Update wagmi config based on frame context
      if (context) {
        setConfig(createConfig({
          chains: [DEFAULT_CHAIN],
          connectors: [frameConnector()],
          ssr: true,
          transports,
          syncConnectedChain: true,
        }));
      }
    };
    if (sdk && !isFrameLoaded) {
      setIsFrameLoaded(true);
      void load();
    }
  }, [isFrameLoaded, setConfig]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isFrameLoaded) {
    return null;
  }

  if (!config) return null;

  return (
    <ThirdwebProvider>
      <WagmiProvider config={config}>
        <OnchainKitProvider
          apiKey={env.NEXT_PUBLIC_CDP_API_KEY}
          chain={DEFAULT_CHAIN}
          schemaId={EAS_SCHEMA_ID}
          projectId={env.NEXT_PUBLIC_CDP_PROJECT_ID}
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