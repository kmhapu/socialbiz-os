// Application Configuration

// ==========================================
// SAAS PAYWALL TOGGLE
// ==========================================
// When you are ready to enforce payments, set this to true.
// If true, users without an active subscription or free trial will be redirected to the /pricing page.
export const REQUIRE_ACTIVE_SUBSCRIPTION = false; 

// ==========================================
// PRICING PLANS
// ==========================================
// You can easily edit the names, prices, and features of your plans here.
// When you create these products in your Stripe Dashboard, copy their "Price ID" (starts with price_xxx)
// and paste them into the stripePriceId fields below.
export const PRICING_PLANS = [
  {
    id: "monthly",
    name: "Monthly Plan",
    price: "$29",
    priceBdt: "৳3,000",
    interval: "per month",
    description: "Perfect for starting businesses.",
    stripePriceId: "price_monthly_placeholder", 
    features: [
      "1-Month Free Trial",
      "Unlimited Products",
      "Unlimited Orders",
      "AI Messaging Inbox",
      "Facebook Integration"
    ]
  },
  {
    id: "half-yearly",
    name: "6-Month Plan",
    price: "$149",
    priceBdt: "৳15,000",
    interval: "every 6 months",
    description: "Save 15% with semi-annual billing.",
    stripePriceId: "price_halfyearly_placeholder",
    features: [
      "1-Month Free Trial",
      "Everything in Monthly",
      "Priority Email Support",
      "Advanced Analytics",
    ]
  },
  {
    id: "yearly",
    name: "Yearly Plan",
    price: "$249",
    priceBdt: "৳25,000",
    interval: "per year",
    description: "Save 28% with annual billing (Best Value).",
    stripePriceId: "price_yearly_placeholder",
    features: [
      "1-Month Free Trial",
      "Everything in 6-Month Plan",
      "Dedicated Account Manager",
      "Custom Integrations",
      "24/7 Phone Support"
    ]
  }
];
