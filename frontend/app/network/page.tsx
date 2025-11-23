import NetworkTabs from '@/components/network/NetworkTabs';

export default function NetworkPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Network Activity</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed mt-4">
          A real-time, simulated feed of transactions being analyzed by ChainGuard across our supported platforms.
        </p>
      </div>
      <NetworkTabs />
    </div>
  );
}
