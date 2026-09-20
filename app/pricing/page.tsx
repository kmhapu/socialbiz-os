"use client";

import { PRICING_PLANS, REQUIRE_ACTIVE_SUBSCRIPTION } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async (priceId: string) => {
    setLoadingId(priceId);
    
    // Soft Launch Logic
    if (!REQUIRE_ACTIVE_SUBSCRIPTION) {
      alert("Test Mode: In a live environment, this would securely transfer you to Stripe. (You can turn live mode on in lib/config.ts)");
      router.push("/dashboard");
      setLoadingId(null);
      return;
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Please ensure your Stripe API keys are configured correctly.");
      }
    } catch (e) {
      alert("Something went wrong");
    }
    
    setLoadingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Start your 1-month free trial today. Upgrade, downgrade, or cancel anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full pb-20">
        {PRICING_PLANS.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 ml-2">{plan.interval}</span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleCheckout(plan.stripePriceId)}
                disabled={loadingId === plan.stripePriceId}
                className="w-full" 
                size="lg"
              >
                {loadingId === plan.stripePriceId ? "Loading..." : "Start Free Trial"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
