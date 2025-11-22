"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', risk: 40 },
  { name: 'Feb', risk: 30 },
  { name: 'Mar', risk: 50 },
  { name: 'Apr', risk: 45 },
  { name: 'May', risk: 60 },
  { name: 'Jun', risk: 55 },
  { name: 'Jul', risk: 70 },
];

export default function BehaviorChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="risk" stroke="#8884d8" fillOpacity={1} fill="url(#colorRisk)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
