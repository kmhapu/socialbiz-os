"use client";

import { PRICING_PLANS, REQUIRE_ACTIVE_SUBSCRIPTION } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [currency, setCurrency] = useState<"USD" | "BDT">("USD");
  const router = useRouter();

  const handleCheckout = async (planId: string, stripePriceId: string, method: string) => {
    setLoadingId(planId + method);
    
    // Soft Launch Logic for Local Gateways
    if (method !== "stripe") {
       alert(`Simulating redirect to ${method.toUpperCase()} gateway for ${planId}... (Sandbox Mode)`);
       router.push("/dashboard?message=Subscription%20Simulated");
       setLoadingId(null);
       return;
    }

    if (!REQUIRE_ACTIVE_SUBSCRIPTION) {
      alert("Test Mode: In a live environment, this would securely transfer you to Stripe.");
      router.push("/dashboard?message=Subscription%20Simulated");
      setLoadingId(null);
      return;
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: stripePriceId }),
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
      <div className="text-center max-w-3xl mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Start your 1-month free trial today. Upgrade, downgrade, or cancel anytime.
        </p>
      </div>
      
      <div className="flex justify-center mb-12">
        <div className="bg-gray-200 p-1 rounded-lg inline-flex">
          <button 
            onClick={() => setCurrency("USD")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${currency === "USD" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
          >
            International (USD)
          </button>
          <button 
            onClick={() => setCurrency("BDT")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${currency === "BDT" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
          >
            Bangladesh (BDT)
          </button>
        </div>
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
                <span className="text-4xl font-bold text-gray-900">
                  {currency === "USD" ? plan.price : plan.priceBdt}
                </span>
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
            <CardFooter className="flex flex-col gap-2">
              {currency === "USD" ? (
                <Button 
                  onClick={() => handleCheckout(plan.id, plan.stripePriceId, "stripe")}
                  disabled={loadingId !== null}
                  className="w-full bg-indigo-600 hover:bg-indigo-700" 
                  size="lg"
                >
                  {loadingId === plan.id + "stripe" ? "Loading..." : "Pay with Card (Stripe)"}
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => handleCheckout(plan.id, plan.stripePriceId, "bkash")}
                    disabled={loadingId !== null}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white" 
                    size="lg"
                  >
                    {loadingId === plan.id + "bkash" ? "Loading..." : "Pay with bKash"}
                  </Button>
                  <Button 
                    onClick={() => handleCheckout(plan.id, plan.stripePriceId, "nagad")}
                    disabled={loadingId !== null}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white" 
                    size="lg"
                  >
                    {loadingId === plan.id + "nagad" ? "Loading..." : "Pay with Nagad"}
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
