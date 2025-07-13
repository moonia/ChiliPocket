import { arbitrum, mainnet, polygon } from "@wagmi/core/chains";
import { defaultWagmiConfig } from "@reown/appkit-wagmi-react-native";

export const projectId = process.env.EXPO_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export const metadata = {
  name: "Chili Pocket",
  description: "Chili Pocket App",
  url: "https://reown.com/appkit",
  icons: ["https://avatars.githubusercontent.com/u/179229932"]
};

export const chains = [mainnet, polygon, arbitrum] as const;

export const wagmiConfig = defaultWagmiConfig({ 
  chains, 
  projectId, 
  metadata 
});

export const appKitOptions = {
  projectId,
  wagmiConfig,
  defaultChain: mainnet,
  enableAnalytics: true,
};
