"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useConnect, useDisconnect, useWalletClient } from 'wagmi';
import { injected } from 'wagmi/connectors';

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

    const debugAndSend = async () => {
        if (!toAddr || !amount) return alert("Fill all fields");
        if (!provider || !walletClient || !address) return alert("Wallet not connected properly");

        setStatus("Fetching Data from Blockchain...");

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

            console.clear();
            console.log("%c✅ THIS IS THE DATA YOUR FRONTEND WILL SEND:", "color: #0f0; font-size: 16px;");
            console.log(JSON.stringify(dataForModel, null, 4));
            console.log("Data received! Now sending transaction...");

            setStatus("Check Console! Sending Transaction...");

            const val = 1;
            if (val) {
                const txHash = await walletClient.sendTransaction({
                    to: toAddr as `0x${string}`,
                    value: valWei,
                    gasLimit: gasLimit
                });
                setStatus("Tx Sent! Hash: " + txHash);
                await provider.waitForTransaction(txHash);
                setStatus("Transaction Confirmed! Money Moved.");
            } else {
                console.log("Debug Mode: Transaction not sent.");
            }

        } catch (err: any) {
            console.error(err);
            setStatus("Error: " + err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white font-sans text-center p-8 rounded-lg shadow-lg max-w-lg w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
                <h1 className="text-3xl font-bold mb-4">🛠️ Data & Wallet Debugger</h1>
                <p className="mb-6">This tool bypasses the AI Model completely.</p>

                {!isConnected ? (
                    <button onClick={handleConnect} className="px-6 py-3 text-lg cursor-pointer bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                        Connect MetaMask
                    </button>
                ) : (
                    <div className="space-y-4">
                        <p>Connected: <span className="text-cyan-400">{address ? `${address.substring(0, 6)}...` : ''}</span></p>
                        
                        <input 
                            type="text" 
                            value={toAddr}
                            onChange={(e) => setToAddr(e.target.value)}
                            placeholder="Receiver Address (0x...)" 
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input 
                            type="text" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount (ETH)" 
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        
                        <button onClick={debugAndSend} className="w-full py-3 bg-green-600 text-white rounded-md text-lg cursor-pointer hover:bg-green-700 transition-colors">
                            Print Data & Send Money 🚀
                        </button>
                        
                        <p className="text-sm text-yellow-400">⚠️ Open Console (F12) to see the Data!</p>
                    </div>
                )}

                <p className="mt-6 text-gray-400 h-6">{status}</p>
            </div>
        </div>
    );
}
