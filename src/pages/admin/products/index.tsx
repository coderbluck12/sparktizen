import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  imageUrls?: string[];
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Product, 'id'>),
        }));
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(product => product.id !== id));
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product: ', error);
        alert('Failed to delete product.');
      }
    }
  };

  const getProductImage = (product: Product): string => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }
    return product.imageUrl || 'https://via.placeholder.com/150?text=No+Image';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-foreground border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Product Management</h1>
              <p className="text-sm text-muted-foreground mt-1">View, edit, or delete products from your inventory</p>
            </div>
            <Link 
              to="/admin" 
              className="px-4 py-2 text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity text-center"
            >
              Add Product
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="bg-card border-2 border-border p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-foreground">No products</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new product.</p>
            <div className="mt-6">
              <Link
                to="/admin"
                className="inline-flex items-center px-4 py-2 text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity"
              >
                Add Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-card border-2 border-border">
            {/* Mobile view */}
            <div className="block md:hidden">
              <div className="divide-y divide-border">
                {products.map(product => (
                  <div key={product.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex gap-4">
                      <img 
                        src={getProductImage(product)} 
                        alt={product.name} 
                        className="h-20 w-20 object-cover border-2 border-border flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground mb-1 truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                        <p className="text-sm font-semibold text-foreground mb-3">₦{product.price.toFixed(2)}</p>
                        <div className="flex gap-3">
                          <Link 
                            to={`/admin/products/edit/${product.id}`} 
                            className="text-sm text-foreground hover:underline"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id)} 
                            className="text-sm text-destructive hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Image</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={getProductImage(product)} 
                          alt={product.name} 
                          className="h-12 w-12 object-cover border-2 border-border" 
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs">
                        <div className="line-clamp-2">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">₦{product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        <Link 
                          to={`/admin/products/edit/${product.id}`} 
                          className="text-foreground hover:underline transition-colors"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="text-destructive hover:underline transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;