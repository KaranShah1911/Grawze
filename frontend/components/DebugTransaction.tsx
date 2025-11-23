"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useConnect, useDisconnect, useWalletClient } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X } from 'lucide-react';

interface DebugTransactionProps {
    onClose: () => void;
}

export default function DebugTransaction({ onClose }: DebugTransactionProps) {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { data: walletClient } = useWalletClient();

    const [toAddr, setToAddr] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');
    const [prediction, setPrediction] = useState<{ risk_score: number; alert: string } | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

    useEffect(() => {
        if (window.ethereum) {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            setProvider(browserProvider);
        } else {
            alert("Install MetaMask!");
        }
    }, []);

    const handleConnect = async () => {
        if (!window.ethereum) return alert("Install MetaMask!");
        try {
            connect({ connector: injected() });
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x539' }], // Ganache
            });
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                alert("Please add Ganache Network to MetaMask manually first!");
            }
        }
    };

    const handleAnalyzeTransaction = async () => {
        if (!toAddr || !amount) return alert("Fill all fields");
        if (!provider || !walletClient || !address) return alert("Wallet not connected properly");

        setStatus("Analyzing transaction with AI...");

        try {
            const valWei = ethers.parseEther(amount);
            const nonce = await provider.getTransactionCount(address);
            const feeData = await provider.getFeeData();
            const gasPrice = feeData.gasPrice || 20000000000n;

            let gasLimit = 21000n;
            try {
                gasLimit = await provider.estimateGas({ to: toAddr, value: valWei });
            } catch (e) { /* Ignore estimation error */ }

            const dataForModel = {
                from_address: address,
                to_address: toAddr,
                value: valWei.toString(),
                gas: Number(gasLimit),
                gas_price: gasPrice.toString(),
                input_data: "0x",
                nonce: nonce,
                timestamp: Math.floor(Date.now() / 1000)
            };

            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataForModel),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Prediction failed');
            }

            const predictionResult = await response.json();
            setPrediction(predictionResult);
            setShowConfirmation(true);
            setStatus(''); // Clear status, confirmation modal will show info

        } catch (err: any) {
            console.error(err);
            setStatus("Error analyzing transaction: " + err.message);
        }
    };

    const handleConfirmSend = async () => {
        if (!toAddr || !amount || !provider || !walletClient) return;

        setShowConfirmation(false);
        setStatus("Sending transaction...");

        try {
            const valWei = ethers.parseEther(amount);
            const txHash = await walletClient.sendTransaction({
                to: toAddr as `0x${string}`,
                value: valWei,
            });
            setStatus("Transaction sent! Hash: " + txHash.slice(0, 10) + "...");
            await provider.waitForTransaction(txHash);
            setStatus("✅ Transaction Confirmed!");
        } catch (err: any) {
            console.error(err);
            setStatus("Error sending transaction: " + err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <Card className="w-full max-w-md relative">
                <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4">
                    <X className="h-4 w-4" />
                </Button>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Make a Transaction</CardTitle>
                    <CardDescription>Leveraging our AI Model to risk out your transaction with fraudulent.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    {!isConnected ? (
                        <Button onClick={handleConnect} size="lg">
                            Connect MetaMask
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Connected as <span className="font-mono text-primary">{address ? `${address.substring(0, 6)}...${address.slice(-4)}` : ''}</span></p>
                            <Input
                                type="text"
                                value={toAddr}
                                onChange={(e) => setToAddr(e.target.value)}
                                placeholder="Receiver Address (0x...)"
                            />
                            <Input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount (ETH)"
                            />
                            <Button onClick={handleAnalyzeTransaction} className="w-full" size="lg">
                                Analyze Transaction
                            </Button>
                        </div>
                    )}
                    <p className="mt-4 text-muted-foreground h-6 text-sm">{status}</p>

                    {showConfirmation && prediction && (
                        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                            <Card className="w-full max-w-sm">
                                <CardHeader>
                                    <CardTitle>Transaction Risk</CardTitle>
                                    <CardDescription>
                                        Our AI has analyzed your transaction. Do you want to proceed?
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center space-y-4">
                                    <div className={`text-5xl font-bold ${prediction.alert === 'CRITICAL' ? 'text-red-500' : 'text-green-500'}`}>
                                        {prediction.risk_score}%
                                    </div>
                                    <p className={`font-semibold ${prediction.alert === 'CRITICAL' ? 'text-red-500' : 'text-green-500'}`}>
                                        {prediction.alert === 'CRITICAL' ? 'High Risk' : 'Low Risk'}
                                    </p>
                                    <div className="flex justify-around pt-4">
                                        <Button variant="destructive" onClick={() => setShowConfirmation(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="default" onClick={handleConfirmSend}>
                                            Proceed
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}