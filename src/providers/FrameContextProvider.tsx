import sdk, { type FrameContext } from '@farcaster/frame-sdk';
import { createContext, type FC, useContext, useEffect, useState } from 'react';

type FrameContextProviderProps = {
  children: React.ReactNode;
};

const FrameContextContext = createContext<{
  frameContext: FrameContext | undefined;
  isFrameLoaded: boolean;
}>({
  frameContext: undefined,
  isFrameLoaded: false,
});

export const useFrameContext = () => useContext(FrameContextContext);

export const FrameContextProvider: FC<FrameContextProviderProps> = ({ children }) => {
  const [isFrameLoaded, setIsFrameLoaded] = useState<boolean>(false);
  const [frameContext, setFrameContext] = useState<FrameContext>();

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

  if (!isFrameLoaded) {
    return null;
  }

  return (
    <FrameContextContext.Provider value={{ frameContext, isFrameLoaded }}>
      {children}
    </FrameContextContext.Provider>
  );
};

export default FrameContextProvider;