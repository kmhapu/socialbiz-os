import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("order_id");
  const amount = searchParams.get("amount");
  const method = searchParams.get("method");
  const successUrl = searchParams.get("success_url");
  const cancelUrl = searchParams.get("cancel_url");

  if (!orderId || !successUrl || !cancelUrl) {
    return new Response("Missing required parameters", { status: 400 });
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mock ${method?.toUpperCase()} Gateway</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f9fafb; }
        .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 100%; }
        .btn { display: inline-block; padding: 10px 20px; margin: 10px; border-radius: 4px; text-decoration: none; font-weight: bold; cursor: pointer; border: none; }
        .btn-success { background-color: #10b981; color: white; }
        .btn-danger { background-color: #ef4444; color: white; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Mock Payment Aggregator</h2>
        <p>Paying with: <strong>${method?.toUpperCase()}</strong></p>
        <p>Order ID: <strong>${orderId}</strong></p>
        <p>Amount: <strong>${amount} BDT</strong></p>
        
        <div style="margin-top: 2rem;">
          <a href="${successUrl}?order_id=${orderId}&status=success&method=${method}" class="btn btn-success">Simulate Payment Success</a>
          <a href="${successUrl}?order_id=${orderId}&status=failed&method=${method}" class="btn btn-danger">Simulate Payment Failed</a>
        </div>
        <div style="margin-top: 1rem;">
          <a href="${cancelUrl}" style="color: #6b7280; text-decoration: underline;">Cancel and return</a>
        </div>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
