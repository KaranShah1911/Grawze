"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const mockTransactions = [
  {
    hash: '0x123...abc',
    to: '0x456...def',
    value: '0.5 ETH',
    risk: 'Low',
    timestamp: '2 mins ago',
  },
  {
    hash: '0x789...ghi',
    to: '0xabc...123',
    value: '1.2 ETH',
    risk: 'High',
    timestamp: '5 mins ago',
  },
  {
    hash: '0xdef...456',
    to: '0xghi...789',
    value: '0.1 ETH',
    risk: 'Medium',
    timestamp: '10 mins ago',
  },
  {
    hash: '0xabc...123',
    to: '0xdef...456',
    value: '2.0 ETH',
    risk: 'Low',
    timestamp: '1 hour ago',
  },
];

const getRiskBadge = (risk: string) => {
  switch (risk) {
    case 'Low':
      return <Badge variant="default" className="bg-green-500">Low</Badge>;
    case 'Medium':
      return <Badge variant="default" className="bg-yellow-500">Medium</Badge>;
    case 'High':
      return <Badge variant="destructive">High</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export default function TransactionList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((tx) => (
              <TableRow key={tx.hash}>
                <TableCell className="font-mono">{tx.hash}</TableCell>
                <TableCell className="font-mono">{tx.to}</TableCell>
                <TableCell>{tx.value}</TableCell>
                <TableCell>{getRiskBadge(tx.risk)}</TableCell>
                <TableCell>{tx.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
