import { getDashboardStats, getDashboardTopStats } from "@/lib/data/orders";

export default async function DashboardPage() {
  const { revenue, orderCount } = await getDashboardStats();
  const { topProducts, topCustomers } = await getDashboardTopStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Revenue</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">${revenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">{orderCount}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-bold mb-4">Top Customers</h2>
          <div className="space-y-4">
            {topCustomers.map((customer: any) => (
              <div key={customer.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-sm">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">${customer.totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{customer.orderCount} orders</p>
                </div>
              </div>
            ))}
            {topCustomers.length === 0 && <p className="text-sm text-gray-500">No customers found.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-bold mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product: any) => (
              <div key={product.id} className="flex justify-between items-center border-b pb-2">
                <p className="font-medium text-sm">{product.name}</p>
                <div className="text-right">
                  <p className="font-bold text-sm">${product.totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{product.quantity} sold</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-gray-500">No products found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
