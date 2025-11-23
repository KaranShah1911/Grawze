import { serviceProviders } from '@/lib/mock-data';

export default function ServiceProviderList() {
  return (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">Supported Platforms</h3>
      <div className="flex justify-center items-center space-x-8">
        {serviceProviders.map((provider) => (
          <div key={provider.name} className="flex flex-col items-center">
            <provider.logo className="h-12 w-12 text-muted-foreground" />
            <span className="text-xs mt-2 text-muted-foreground">{provider.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
