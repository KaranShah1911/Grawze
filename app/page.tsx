"use client";

import { useState } from "react";
import useSWR from "swr";

// shadcn/ui components (assumed available in the project)
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Types
type TxFeature = {
  txHash: string;
  sender: string;
  recipient?: string;
  value: number; // ETH or token units for display
  gasUsed: number;
  nonce: number;
  features: Record<string, number | string | boolean>;
  predicted: "Normal" | "Fraudulent";
  confidence: number; // 0..1
};

// Simple risk scoring: confidence -> 0..100, biased towards reducing false positives
function confidenceToRisk(conf: number) {
  // Emphasize higher confidence while compressing mid-range to reduce false positives
  // risk = round( (conf^1.3) * 100 )
  return Math.round(Math.pow(conf, 1.3) * 100);
}

function actionForRisk(score: number) {
  if (score >= 80) return { label: "High Risk: Flag Wallet for Investigation", variant: "destructive" };
  if (score >= 60) return { label: "Medium Risk: Add Sender to Watchlist", variant: "warning" };
  if (score >= 40) return { label: "Low Risk: Monitor", variant: "secondary" };
  return { label: "No Action", variant: "subtle" };
}

// Mock fallback data (10 riskiest transactions) — replace by API in prod
const mockTopRisks: TxFeature[] = [
  {
    txHash: "0x9f8a...a4e1",
    sender: "0xFA1b...c12E",
    recipient: "0xB12c...d9f0",
    value: 125.3,
    gasUsed: 21000,
    nonce: 441,
    features: { avg_send_value: 80.2, txs_last_hour: 7, label_score: 0.02 },
    predicted: "Fraudulent",
    confidence: 0.97,
  },
  {
    txHash: "0x5b4c...77b2",
    sender: "0xD34f...091A",
    recipient: "0xC212...ffe1",
    value: 0.02,
    gasUsed: 125000,
    nonce: 12,
    features: { token_in: "USDC", txs_last_min: 3 },
    predicted: "Fraudulent",
    confidence: 0.86,
  },
  {
    txHash: "0x3c1d...a2b3",
    sender: "0xE3a2...3f11",
    recipient: "0xAbe2...4cde",
    value: 5000,
    gasUsed: 300000,
    nonce: 992,
    features: { new_address: true, score_abnormal_flow: 0.9 },
    predicted: "Fraudulent",
    confidence: 0.78,
  },
  {
    txHash: "0x1134...f9de",
    sender: "0xB11a...00AA",
    recipient: "0xF01b...88ff",
    value: 0.5,
    gasUsed: 45000,
    nonce: 38,
    features: { internal_calls: 12, swap_count: 3 },
    predicted: "Normal",
    confidence: 0.52,
  },
  {
    txHash: "0x291b...0123",
    sender: "0x12aa...bbcc",
    recipient: "0x22bb...ccdd",
    value: 10.0,
    gasUsed: 210000,
    nonce: 5,
    features: { value_to_balance: 0.9, historical_vol: 0.01 },
    predicted: "Fraudulent",
    confidence: 0.66,
  },
  {
    txHash: "0x8a9d...7f7e",
    sender: "0x99aa...ffee",
    recipient: "0x88bb...7766",
    value: 0.0001,
    gasUsed: 21000,
    nonce: 1,
    features: { dust: true },
    predicted: "Normal",
    confidence: 0.12,
  },
  {
    txHash: "0x77e1...9c4a",
    sender: "0xabc1...1111",
    recipient: "0xabc1...2222",
    value: 250.0,
    gasUsed: 21000,
    nonce: 1001,
    features: { mixing_pattern: 0.8 },
    predicted: "Fraudulent",
    confidence: 0.92,
  },
  {
    txHash: "0x44d2...fd12",
    sender: "0x0f0f...0f0f",
    recipient: "0xf0f0...f0f0",
    value: 2.2,
    gasUsed: 100000,
    nonce: 402,
    features: { bridge_used: "unknown" },
    predicted: "Normal",
    confidence: 0.39,
  },
  {
    txHash: "0x99aa...5b5b",
    sender: "0xaaaa...bbbb",
    recipient: "0xcccc...dddd",
    value: 800.5,
    gasUsed: 260000,
    nonce: 888,
    features: { flashloan: true, loans: 1 },
    predicted: "Fraudulent",
    confidence: 0.83,
  },
  {
    txHash: "0x1020...ff03",
    sender: "0x0011...2233",
    recipient: "0x4455...6677",
    value: 0.45,
    gasUsed: 21000,
    nonce: 17,
    features: { label_score: 0.15 },
    predicted: "Normal",
    confidence: 0.34,
  },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ChainGuardTopRisksPage() {
  const { data } = useSWR<TxFeature[]>("/api/chainguard/top-risks", fetcher, { fallbackData: mockTopRisks, revalidateOnFocus: false });
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<'risk' | 'value' | 'confidence'>('risk');
  const [descending, setDescending] = useState(true);

  const enriched = (data ?? mockTopRisks).map((t) => {
    const risk = confidenceToRisk(t.confidence);
    return { ...t, risk };
  });

  const filtered = enriched
    .filter((t) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return t.txHash.toLowerCase().includes(q) || t.sender.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const dir = descending ? -1 : 1;
      if (sortBy === 'risk') return dir * (a.risk - b.risk);
      if (sortBy === 'value') return dir * (a.value - b.value);
      return dir * (a.confidence - b.confidence);
    })
    .slice(0, 10);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">ChainGuard — Top 10 Riskiest Transactions</span>
            <div className="flex gap-2 items-center">
              <Input placeholder="Search tx hash or sender" value={query} onChange={(e) => setQuery((e.target as HTMLInputElement).value)} />
              <Button variant="secondary" onClick={() => { setDescending(!descending); }}>
                {descending ? 'Desc' : 'Asc'}
              </Button>
              <select className="rounded-md border px-2 py-1" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="risk">Risk</option>
                <option value="value">Value</option>
                <option value="confidence">Confidence</option>
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="px-2 py-2">Tx Hash</th>
                  <th className="px-2 py-2">Sender</th>
                  <th className="px-2 py-2">Value</th>
                  <th className="px-2 py-2">Gas</th>
                  <th className="px-2 py-2">Predicted</th>
                  <th className="px-2 py-2">Confidence</th>
                  <th className="px-2 py-2">Risk</th>
                  <th className="px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const action = actionForRisk(t.risk as number);
                  return (
                    <tr key={t.txHash} className="border-b">
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <a className="font-mono text-sm truncate max-w-[18rem]" href={`https://etherscan.io/tx/${t.txHash}`} target="_blank" rel="noreferrer">
                            {t.txHash}
                          </a>
                          <Button size="sm" variant="ghost" onClick={() => navigator.clipboard?.writeText(t.txHash)}>
                            Copy
                          </Button>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="truncate max-w-[14rem]">{t.sender}</div>
                      </td>
                      <td className="px-2 py-3">{t.value}</td>
                      <td className="px-2 py-3">{t.gasUsed}</td>
                      <td className="px-2 py-3">
                        <Badge variant={t.predicted === 'Fraudulent' ? 'destructive' : 'secondary'}>{t.predicted}</Badge>
                      </td>
                      <td className="px-2 py-3">{Math.round(t.confidence * 100)}%</td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-3">
                          <div className="font-mono">{t.risk}</div>
                          <div className="w-36 bg-muted h-2 rounded overflow-hidden">
                            <div style={{ width: `${t.risk}%` }} className="h-2 rounded bg-gradient-to-r from-red-500 via-yellow-400 to-green-400" />
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex flex-col gap-2">
                          <Badge>{action.label}</Badge>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => alert(`Open investigation panel for ${t.sender}`)}>Investigate</Button>
                            <Button size="sm" variant="outline" onClick={() => alert(`Add ${t.sender} to watchlist (mock)`)}>Watchlist</Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Precision-focused evaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">This frontend prioritizes Precision and provides clear action labels. Connect <code>/api/chainguard/top-risks</code> to return an array of transaction features with predictions and confidence scores.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API contract (example)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs">{`[ { txHash, sender, recipient, value, gasUsed, nonce, features, predicted, confidence } ]`}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 text-sm">
                  <li>Risk score computed from model confidence with mild exponent to reduce mid-range false positives.</li>
                  <li>Action mapping: Risk {">"}= 80 -{">"} Flag, 60-79 -{">"} Watchlist, 40-59 -{">"} Monitor.</li>
                  <li>Replace mock data by calling your inference API; keep the frontend read-only to minimize accidental writes.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
