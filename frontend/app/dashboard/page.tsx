"use client";

import WalletSummary from '@/components/dashboard/WalletSummary';
import TransactionList from '@/components/dashboard/TransactionList';
import BehaviorChart from '@/components/dashboard/BehaviorChart';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <h2 className="text-2xl font-bold mb-4">Please connect your wallet to view the dashboard.</h2>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <WalletSummary />
          </div>
          <div className="md:col-span-2">
            <BehaviorChart />
          </div>
        </div>
        <div>
          <TransactionList />
        </div>
      </div>
    </div>
  );
}
