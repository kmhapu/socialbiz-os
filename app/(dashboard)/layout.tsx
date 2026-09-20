import Link from "next/link";
import { ReactNode } from "react";
import { REQUIRE_ACTIVE_SUBSCRIPTION } from "@/lib/config";
import { redirect } from "next/navigation";
import { signout } from "@/app/actions";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // If soft-launch is over, require active subscription
  // In a full implementation, you would query the DB here to check their real status
  // e.g., const profile = await supabase.from('profiles').select('status').single();
  // if (REQUIRE_ACTIVE_SUBSCRIPTION && profile.status !== 'active') redirect('/pricing');

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">SocialBiz OS</h1>
          <nav className="flex flex-col space-y-4">
            <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            <Link href="/inbox" className="hover:text-gray-300">Inbox</Link>
            <Link href="/products" className="hover:text-gray-300">Products</Link>
            <Link href="/orders" className="hover:text-gray-300">Orders</Link>
            <Link href="/customers" className="hover:text-gray-300">Customers</Link>
            <Link href="/content" className="hover:text-gray-300">Content</Link>
            <Link href="/settings" className="hover:text-gray-300">Settings</Link>
          </nav>
        </div>
        <form action={signout}>
          <button type="submit" className="text-gray-400 hover:text-white mt-8">
            Sign Out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
