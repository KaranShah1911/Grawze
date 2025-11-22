import Link from 'next/link';
import { ShieldCheck, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 py-6 w-full">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <ShieldCheck className="h-6 w-6 text-primary mr-2" />
          <span className="text-lg font-semibold">ChainGuard</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 md:mb-0">&copy; {new Date().getFullYear()} ChainGuard. All rights reserved.</p>
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
            <Github className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
