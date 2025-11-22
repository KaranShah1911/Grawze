"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function AddressProfile({ address }: { address: string }) {
  // Mock data for the profile
  const profile = {
    riskScore: 25,
    reputation: 'High Risk',
    badges: ['Known Scammer', 'High Volume'],
    flaggedTxs: [
      {
        hash: '0xabc...123',
        reason: 'Interaction with blacklisted address',
      },
      {
        hash: '0xdef...456',
        reason: 'Phishing attempt detected',
      },
    ],
  };

  const riskColor = profile.riskScore > 75 ? 'text-green-500' : profile.riskScore > 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Reputation Profile</CardTitle>
        <p className="text-sm text-muted-foreground font-mono break-all">{address}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center p-6 bg-secondary/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Overall Risk Score</h3>
            <div className={`text-6xl font-bold ${riskColor}`}>{profile.riskScore}</div>
            <p className={`font-semibold ${riskColor}`}>{profile.reputation}</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reputation Badges</h3>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge) => (
                <Badge key={badge} variant="outline">{badge}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Flagged Transactions</h3>
          <div className="space-y-4">
            {profile.flaggedTxs.map((tx) => (
              <div key={tx.hash} className="flex items-start p-4 bg-destructive/10 rounded-lg">
                <ShieldAlert className="h-5 w-5 text-destructive mr-4 mt-1" />
                <div>
                  <p className="font-semibold font-mono text-sm">{tx.hash}</p>
                  <p className="text-sm text-muted-foreground">{tx.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
