import { getOrders } from "@/lib/data/orders";
import { getProducts } from "@/lib/data/products";
import { createOrder, confirmOrder } from "@/lib/actions/order";

export default async function OrdersPage() {
  const orders = await getOrders();
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{order.customers?.name || "Unknown"}</div>
                      <div className="text-gray-500 text-xs">{order.id.slice(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.status !== 'confirmed' && (
                        <form action={async () => {
                          "use server";
                          await confirmOrder(order.id);
                        }}>
                          <button type="submit" className="text-indigo-600 hover:text-indigo-900">
                            Confirm
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Create Order</h2>
            <form action={createOrder} className="space-y-4">
              <div>
                <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product</label>
                <select name="productId" id="productId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ${p.price} ({p.stock} in stock)</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" min="1" defaultValue="1" name="quantity" id="quantity" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
                Create Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
