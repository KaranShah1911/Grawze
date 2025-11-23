import { Coinbase, Metamask, WalletConnect } from '@/components/icons';

export const serviceProviders = [
  {
    name: 'MetaMask',
    logo: Metamask,
  },
  {
    name: 'Coinbase Wallet',
    logo: Coinbase,
  },
  {
    name: 'WalletConnect',
    logo: WalletConnect,
  },
];

const sampleAddresses = [
  '0x1a2b3c...d4e5f6',
  '0x7g8h9i...j0k1l2',
  '0x3m4n5o...p6q7r8',
  '0x9s0t1u...v2w3x4',
  '0x5y6z7a...b8c9d0',
];

export const generateMockTransaction = () => {
  const isFraudulent = Math.random() > 0.85; // 15% chance of being fraudulent
  const provider = serviceProviders[Math.floor(Math.random() * serviceProviders.length)];
  const from = sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)];
  const to = sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)];
  const value = (Math.random() * 5).toFixed(3);

  return {
    id: `0x${[...Array(10)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    provider,
    from,
    to,
    value: `${value} ETH`,
    isFraudulent,
    timestamp: new Date(),
  };
};
