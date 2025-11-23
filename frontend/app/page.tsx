import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, Bot, BarChart, Zap, ShieldAlert, BrainCircuit } from 'lucide-react';
import AnimatedGridBackground from '@/components/AnimatedGridBackground';

export default function Home() {
  return (
    <>
      <section className="w-full relative">
        <AnimatedGridBackground>
          <div className="container px-4 md:px-6 py-24 sm:py-32 lg:py-48 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-linear-to-r from-primary to-accent">
                Secure Your DeFi Transactions with AI
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                ChainGuard provides real-time risk scoring and privacy-preserving analytics to protect your digital assets from fraud and scams.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" variant="outline">View Dashboard</Button>
              </Link>
            </div>
          </div>
        </AnimatedGridBackground>
      </section>
      <section id="features" className="w-full py-20 md:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              ChainGuard offers a suite of tools to keep your digital assets safe. Here's what makes us different.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Bot className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Risk Scoring</h3>
              <p className="text-muted-foreground">
                Our advanced AI analyzes transactions for signs of fraud, scams, and malicious smart contracts, providing a clear risk score before you approve.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <BarChart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Intuitive Behavior Dashboard</h3>
              <p className="text-muted-foreground">
                Track your wallet's activity, monitor for anomalies, and gain insights into your security posture with our user-friendly dashboard.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Privacy-First Analytics</h3>
              <p className="text-muted-foreground">
                Your data is yours. We provide powerful analytics without ever compromising your privacy or storing sensitive information.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <ShieldAlert className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Threat Alerts</h3>
              <p className="text-muted-foreground">
                Receive real-time notifications about high-risk transactions, so you can act immediately to protect your assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Getting started with ChainGuard is simple. Follow these three easy steps to secure your wallet.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Connect Your Wallet</h3>
              <p className="text-muted-foreground">
                Easily connect your MetaMask or other supported wallet in seconds. No lengthy setup required.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <BrainCircuit className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Real-Time Scanning</h3>
              <p className="text-muted-foreground">
                Our AI engine automatically scans all incoming and outgoing transactions for potential risks.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <ShieldAlert className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Get Instant Alerts</h3>
              <p className="text-muted-foreground">
                Receive immediate notifications for any suspicious activity, allowing you to take action before it's too late.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Secure Your Assets?</h2>
            <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
              Don't wait for a security breach. Connect your wallet today and experience the peace of mind that comes with AI-powered protection.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
