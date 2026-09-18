import { getProducts } from "@/lib/data/products";
import { createProduct } from "@/lib/actions/product";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Add Product</h2>
            <form action={createProduct} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
                <input type="text" name="sku" id="sku" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input type="number" step="0.01" name="price" id="price" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" name="stock" id="stock" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
                Save Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
