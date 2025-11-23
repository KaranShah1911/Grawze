"use client";

import { useEffect, useState } from 'react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Transaction {
  hash: string;
  from_address: string;
  to_address: string;
  value_wei: string;
  risk_score: number;
  is_flagged_fraud: boolean;
  created_at: string;
}

interface WalletProfile {
  address: string;
  total_tx_sent: number;
  total_tx_received: number;
  is_known_scam: boolean;
  last_active: string;
  transactions: Transaction[];
}

export default function AddressProfile({ address }: { address: string }) {
  const [profile, setProfile] = useState<WalletProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/wallet/${address}`);
        console.log(response)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          const errorData = await response.json();
          throw new Error(errorData.detail || 'An error occurred');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchProfile();
    }
  }, [address]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!profile) {
    return null;
  }

  const overallRiskScore = profile.transactions.length > 0
    ? profile.transactions[0]!.risk_score : 0;

  const getRiskInfo = (score: number) => {
    if (score > 75) return { reputation: 'High Risk', color: 'text-red-500' };
    if (score > 40) return { reputation: 'Medium Risk', color: 'text-yellow-500' };
    return { reputation: 'Low Risk', color: 'text-green-500' };
  };

  const riskInfo = getRiskInfo(overallRiskScore);

  const badges = [];
  if (profile.is_known_scam) badges.push('Known Scammer');
  if (profile.total_tx_sent + profile.total_tx_received > 100) badges.push('High Volume');

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
            <div className={`text-6xl font-bold ${riskInfo.color}`}>{overallRiskScore}</div>
            <p className={`font-semibold ${riskInfo.color}`}>{riskInfo.reputation}</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Wallet Stats</h3>
            <div className="text-sm">
              <p><strong>Total Transactions Sent:</strong> {profile.total_tx_sent}</p>
              <p><strong>Total Transactions Received:</strong> {profile.total_tx_received}</p>
              <p><strong>Last Active:</strong> {new Date(profile.last_active).toLocaleString()}</p>
            </div>
            <h3 className="text-lg font-semibold">Reputation Badges</h3>
            <div className="flex flex-wrap gap-2">
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <Badge key={badge} variant={badge === 'Known Scammer' ? 'destructive' : 'outline'}>{badge}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No badges yet.</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Transactions (Last 10)</h3>
          <div className="space-y-4">
            {profile.transactions.map((tx) => {
              const txRiskInfo = getRiskInfo(tx.risk_score);
              return (
                <div key={tx.hash} className={`flex items-start p-4 rounded-lg ${
                  tx.is_flagged_fraud ? 'bg-destructive/10' : 'bg-secondary/50'
                }`}>
                  {tx.is_flagged_fraud ? (
                    <ShieldAlert className={`h-5 w-5 ${txRiskInfo.color} mr-4 mt-1`} />
                  ) : (
                    <ShieldCheck className={`h-5 w-5 ${txRiskInfo.color} mr-4 mt-1`} />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold font-mono text-sm break-all">{tx.hash}</p>
                    <div className="grid grid-cols-2 gap-x-4 text-sm">
                      <p><strong>From:</strong> <span className="font-mono">{tx.from_address}</span></p>
                      <p><strong>To:</strong> <span className="font-mono">{tx.to_address}</span></p>
                      <p><strong>Value (ETH):</strong> {(parseFloat(tx.value_wei) / 1e18).toFixed(6)}</p>
                      <p><strong>Risk Score:</strong> <span className={txRiskInfo.color}>{tx.risk_score}</span></p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
