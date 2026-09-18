import { getCustomer } from "@/lib/data/customers";
import { getOrders } from "@/lib/data/orders";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CustomerProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const customer = await getCustomer(params.id);
  
  if (!customer) {
    notFound();
  }

  const allOrders = await getOrders();
  const customerOrders = allOrders.filter((o: any) => o.customer_id === customer.id);
  const ltv = customerOrders.reduce((sum: number, order: any) => sum + (Number(order.total) || 0), 0);
  const tags = ["VIP", "Frequent Buyer"]; // Mock tags if not in DB
  const actualTags = customer.tags || tags;

  return (
    <div>
      <div className="mb-6">
        <Link href="/customers" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Customers</Link>
        <h1 className="text-3xl font-bold">{customer.name}</h1>
        <p className="text-gray-500">{customer.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border md:col-span-1">
          <h2 className="text-lg font-bold mb-4">Profile</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Joined</p>
            <p className="font-medium">{customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "N/A"}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Lifetime Value (LTV)</p>
            <p className="font-medium text-green-600">${ltv.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {actualTags.map((tag: string, idx: number) => (
                <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border md:col-span-2">
          <h2 className="text-lg font-bold mb-4">Order History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/orders/${order.id}`}>#{order.id.slice(0, 8)}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs rounded-full ${order.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {order.status || "Completed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      ${Number(order.total || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {customerOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
