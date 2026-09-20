"use client";

import { useState } from "react";
import { connectFacebookPage } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";

export function FacebookConnect({ pages }: { pages: any[] }) {
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      await connectFacebookPage();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border mb-6">
      <h2 className="text-xl font-semibold mb-4">Channels</h2>
      <p className="text-gray-500 mb-6 text-sm">Connect your social media channels to SocialBiz OS.</p>
      
      <div className="space-y-4">
        {pages.map((page) => (
          <div key={page.id} className="flex items-center justify-between p-4 border rounded">
            <div>
              <p className="font-medium">{page.page_name}</p>
              <p className="text-sm text-gray-500">ID: {page.page_id}</p>
            </div>
            <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
              Connected
            </span>
          </div>
        ))}

        <Button onClick={handleConnect} disabled={loading}>
          {loading ? "Connecting..." : "Connect Facebook Page"}
        </Button>
      </div>
    </div>
  );
}
