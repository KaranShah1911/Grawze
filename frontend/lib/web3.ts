import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  sepolia,
  lineaTestnet,
  avalanche,
  polygon,
  mainnet,
} from "wagmi/chains";

// Define Polygon Amoy manually
const polygonAmoy = {
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-amoy.polygon.technology/"] },
  },
  blockExplorers: {
    default: { name: "Amoy Explorer", url: "https://amoy.polygonscan.com/" },
  },
  testnet: true,
};

// Use your WalletConnect project ID
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

// Create the config using getDefaultConfig
export const config = getDefaultConfig({
  appName: "Web3.0 Auth",
  projectId: projectId,
  chains: [polygonAmoy, sepolia, lineaTestnet, avalanche, polygon, mainnet],
  wallets: [
    {
      groupName: "Other",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  ssr: true, // If your app uses Server-Side Rendering
});
