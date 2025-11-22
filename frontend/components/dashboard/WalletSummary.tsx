"use client";

import { useAccount, useBalance } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function WalletSummary() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please connect your wallet to view your summary.</p>
        </CardContent>
      </Card>
    );
  }

  const riskScore = 85; // Mock risk score
  const riskLevel = riskScore > 75 ? 'Low' : riskScore > 40 ? 'Medium' : 'High';
  const riskColor = riskScore > 75 ? 'bg-green-500' : riskScore > 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Wallet Summary</CardTitle>
        <Badge className={`${riskColor} text-white`}>{riskLevel} Risk</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}</div>
        <p className="text-xs text-muted-foreground truncate">
          {address}
        </p>
      </CardContent>
    </Card>
  );
}
