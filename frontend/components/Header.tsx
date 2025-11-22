import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ThemeProvider, Providers } from "../app/providers";


export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background/95 backdrop-blur-sm border-b border-border/40 fixed top-0 w-full z-50">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <ShieldCheck className="h-6 w-6 text-primary" />
        <span className="sr-only">ChainGuard</span>
      </Link>
      <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
        <Link href="/dashboard" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary" prefetch={false}>
          Dashboard
        </Link>
        <Link href="/reputation" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary" prefetch={false}>
          Reputation
        </Link>
        <Link href="/privacy" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary" prefetch={false}>
          Privacy
        </Link>
        <Link href="/developers" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary" prefetch={false}>
          Developers
        </Link>
        <div className="pl-4">
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}
