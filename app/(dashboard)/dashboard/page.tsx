import { getDashboardStats } from "@/lib/data/orders";

export default async function DashboardPage() {
  const { revenue, orderCount } = await getDashboardStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Revenue</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">${revenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">{orderCount}</p>
        </div>
      </div>
    </div>
  );
}
