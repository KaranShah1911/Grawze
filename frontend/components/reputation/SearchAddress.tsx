"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchAddress({ onSearch }: { onSearch: (address: string) => void }) {
  const [address, setAddress] = useState('');

  const handleSearch = () => {
    if (address) {
      onSearch(address);
    }
  };

  return (
    <div className="flex w-full max-w-2xl items-center space-x-2 mx-auto">
      <Input
        type="text"
        placeholder="Enter wallet address (e.g., 0x...)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" onClick={handleSearch}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
