"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceProviders } from "@/lib/mock-data";
import TransactionFeed from "./TransactionFeed";

export default function NetworkTabs() {
  return (
    <Tabs defaultValue={serviceProviders[0].name} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {serviceProviders.map((provider) => (
          <TabsTrigger key={provider.name} value={provider.name}>
            <provider.logo className="h-5 w-5 mr-2" />
            {provider.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {serviceProviders.map((provider) => (
        <TabsContent key={provider.name} value={provider.name}>
          <TransactionFeed providerName={provider.name} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
