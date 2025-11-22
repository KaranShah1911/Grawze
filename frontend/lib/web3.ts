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

const ganacheLocal = {
  id: 1337,
  name: "Ganache Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:7545"] },
    public: { http: ["http://127.0.0.1:7545"] },
  },
  blockExplorers: {
    default: { name: "Ganache Explorer", url: "http://127.0.0.1:7545" },
  },
  testnet: true,
};

// Use your WalletConnect project ID
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

// Create the config using getDefaultConfig
export const config = getDefaultConfig({
  appName: "Web3.0 Auth",
  projectId: projectId,
  chains: [polygonAmoy, sepolia, lineaTestnet, avalanche, polygon, mainnet, ganacheLocal],
  wallets: [
    {
      groupName: "Other",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  ssr: true, // If your app uses Server-Side Rendering
});
