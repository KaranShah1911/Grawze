"use client";

import { useState } from 'react';
import SearchAddress from '@/components/reputation/SearchAddress';
import AddressProfile from '@/components/reputation/AddressProfile';

export default function ReputationPage() {
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);

  const handleSearch = (address: string) => {
    setSearchedAddress(address);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Wallet Reputation</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed mt-4">
          Look up any wallet address to check its reputation and historical risk score.
        </p>
      </div>
      <SearchAddress onSearch={handleSearch} />
      {searchedAddress && <AddressProfile address={searchedAddress} />}
    </div>
  );
}
