import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, Providers } from "./providers"; // Import your Providers wrapper
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ChainGuard - AI-Powered Web3 Security",
  description:
    "Secure Your DeFi Transactions with AI. Real-time risk scoring and privacy-preserving analytics to protect your digital assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers> {/* Provides Wagmi and RainbowKit wallet context */}
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 pt-14">{children}</main>
              <Footer />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
