"use client";

import { useState, useEffect } from 'react';
import { generateMockTransaction } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';

interface TransactionFeedProps {
  providerName: string;
}

export default function TransactionFeed({ providerName }: TransactionFeedProps) {
  const [transactions, setTransactions] = useState(() => 
    Array.from({ length: 5 }, () => generateMockTransaction()).filter(tx => tx.provider.name === providerName)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTx = generateMockTransaction();
      if (newTx.provider.name === providerName) {
        setTransactions(prev => [newTx, ...prev.slice(0, 4)]);
      }
    }, 1000 + Math.random() * 2000); // Stagger updates
    return () => clearInterval(interval);
  }, [providerName]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Network Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-4">
                {tx.isFraudulent ? (
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                ) : (
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                )}
                <div className="font-mono text-xs">
                  <p className="text-muted-foreground">{tx.from}</p>
                  <p className="flex items-center"><ArrowRight className="h-3 w-3 mx-2" /> {tx.to}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{tx.value}</p>
                <Badge variant={tx.isFraudulent ? 'destructive' : 'default'}>
                  {tx.isFraudulent ? 'Fraudulent' : 'Verified'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
