"use client";

// import { useWeb3Modal } from '@web3modal/wagmi/react';
// import { useAccount, useDisconnect } from 'wagmi';
// import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';


export function ConnectWalletButton() {
  // const { open } = useWeb3Modal();
  // const { address, isConnected } = useAccount();
  // const { disconnect } = useDisconnect();

  // if (isConnected && address) {
  //   return (
  //     <div className="flex items-center gap-4">
  //       <p className="text-sm font-medium">
  //         {`${address.slice(0, 6)}...${address.slice(-4)}`}
  //       </p>
  //       <Button size="lg" onClick={() => disconnect()}>Disconnect</Button>
  //     </div>
  //   );
  // }

  return (
    <ConnectButton />
  );
}
