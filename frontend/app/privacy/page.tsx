import { Shield, Lock, EyeOff, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Your Privacy, Our Priority</h1>
        <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl/relaxed mt-4">
          At ChainGuard, we believe that security and privacy are not mutually exclusive. Our platform is designed from the ground up to provide powerful analytics without ever compromising your personal data.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex items-start">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">On-Device Processing</h3>
              <p className="text-muted-foreground">
                All sensitive data, including your transaction details and wallet information, is processed directly within your browser. Nothing is ever sent to our servers, ensuring complete confidentiality.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
              <EyeOff className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Anonymous Analytics</h3>
              <p className="text-muted-foreground">
                We use aggregated, anonymized data to train our AI models. Your wallet address is never linked to your activity, and we cannot trace analytics back to any individual user.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">No Personal Information Required</h3>
              <p className="text-muted-foreground">
                ChainGuard works without requiring you to sign up, create an account, or provide any personal information. Simply connect your wallet and you're protected.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-accent/10 rounded-full filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="relative bg-card p-8 rounded-lg shadow-lg border">
              <UserCheck className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-center mb-2">Trust Through Transparency</h3>
              <p className="text-muted-foreground text-center">
                We are committed to being transparent about how our technology works. Our privacy-first approach is not just a feature—it's our foundation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
