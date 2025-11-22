import CodeSnippet from '@/components/developers/CodeSnippet';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const getStartedCode = `import { ChainGuard } from '@chainguard/sdk';

const guard = new ChainGuard({ apiKey: 'YOUR_API_KEY' });

async function checkTransaction(tx) {
  const riskScore = await guard.getRiskScore(tx);
  if (riskScore > 80) {
    console.log('High risk transaction detected!');
  }
}`;

const apiEndpointCode = `POST /v1/risk-score

{
  "transaction": {
    "from": "0x...",
    "to": "0x...",
    "value": "1000000000000000000",
    "data": "0x..."
  }
}`;

export default function DevelopersPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Developer Hub</h1>
        <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl/relaxed mt-4">
          Integrate ChainGuard's powerful risk-scoring engine into your dApp, wallet, or exchange with our simple and robust API.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <main className="md:col-span-2 space-y-12">
          <section id="get-started">
            <h2 className="text-2xl font-bold mb-4">Get Started</h2>
            <p className="text-muted-foreground mb-4">
              Getting started with the ChainGuard SDK is easy. Install the package, get your API key, and you're ready to go.
            </p>
            <CodeSnippet code={getStartedCode} language="javascript" />
          </section>

          <section id="api-reference">
            <h2 className="text-2xl font-bold mb-4">API Reference</h2>
            <p className="text-muted-foreground mb-4">
              Our REST API provides direct access to our risk-scoring engine. Here's an example of how to check a transaction.
            </p>
            <CodeSnippet code={apiEndpointCode} language="http" />
          </section>
        </main>
        <aside className="md:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="#get-started" className="text-muted-foreground hover:text-primary">Get Started</a></li>
              <li><a href="#api-reference" className="text-muted-foreground hover:text-primary">API Reference</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-primary">Pricing</a></li>
            </ul>
          </div>
        </aside>
      </div>

      <section id="pricing" className="w-full py-20 md:py-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Pricing Plans</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed mt-4">
            Choose the plan that's right for you. Get started for free and scale as you grow.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Hobby</CardTitle>
              <p className="text-4xl font-bold">$0</p>
              <p className="text-muted-foreground">For personal projects and testing.</p>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />1,000 API calls/month</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Community support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col border-primary shadow-lg">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <p className="text-4xl font-bold">$99</p>
              <p className="text-muted-foreground">For production dApps and businesses.</p>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />100,000 API calls/month</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Priority email support</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Advanced analytics</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Choose Pro</Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <p className="text-4xl font-bold">Custom</p>
              <p className="text-muted-foreground">For large-scale applications.</p>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Unlimited API calls</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Dedicated support</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Custom integrations</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Contact Us</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}

