import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function GeneratePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">Hackathon Idea Generator</h1>
        <div className="flex w-full items-center space-x-2 mb-8">
          <Input type="text" placeholder="Enter keywords (e.g., 'AI', 'healthcare')" />
          <Button type="submit">Generate</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Next Big Idea</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your AI-generated hackathon idea will appear here. Enter some keywords and click "Generate" to get started!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
