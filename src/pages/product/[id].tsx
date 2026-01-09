import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import type { Product } from '../../types';
import { CartContext } from '../../context/CartContext';
import Header from '../../components/Head';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { addToCart } = cartContext;

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const productData = { id: docSnap.id, ...docSnap.data() } as Product;
            setProduct(productData);
            // Check if imageUrls exists and has items, otherwise use imageUrl
            if (productData.imageUrls && productData.imageUrls.length > 0) {
              setSelectedImage(productData.imageUrls[0]);
            } else if (productData.imageUrl) {
              setSelectedImage(productData.imageUrl);
            }
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (id) {
        try {
          const q = query(collection(db, 'products'), limit(5));
          const querySnapshot = await getDocs(q);
          const products = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Product))
            .filter(p => p.id !== id)
            .slice(0, 4);
          setRelatedProducts(products);
        } catch (error) {
          console.error('Error fetching related products:', error);
        }
      }
    };

    fetchRelatedProducts();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  // Helper function to get product image
  const getProductImage = (product: Product) => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }
    return product.imageUrl || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-muted rounded-lg animate-pulse" style={{ paddingBottom: '100%' }}></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
              <div className="h-10 bg-muted rounded animate-pulse w-32 mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Link to="/" className="text-foreground hover:underline">
              ← Back to store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/store" className="hover:text-foreground">Store</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div>
            <div className="bg-card rounded-lg overflow-hidden border border-border">
              <div className="relative" style={{ paddingBottom: '100%' }}>
                <img 
                  src={selectedImage || getProductImage(product)} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300"
                />
              </div>
            </div>
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {product.imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`rounded-lg overflow-hidden border-2 ${selectedImage === url ? 'border-primary' : 'border-transparent'} cursor-pointer hover:border-input transition-colors`}
                    onClick={() => setSelectedImage(url)}
                  >
                    <div className="relative" style={{ paddingBottom: '100%' }}>
                      <img 
                        src={url} 
                        alt={`${product.name} thumbnail ${index + 1}`} 
                        className="absolute inset-0 w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-card rounded-lg border border-border p-6 lg:p-8 h-fit">
            <h1 className="text-3xl font-semibold text-foreground mb-4">{product.name}</h1>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-foreground">₦{product.price.toFixed(2)}</span>
            </div>

            <div className="border-t border-border pt-6 mb-6">
              <h2 className="text-sm font-medium text-foreground mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!product.inStock}
                  className="w-10 h-10 rounded-lg border border-input flex items-center justify-center hover:bg-secondary text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg">−</span>
                </button>
                <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.inStock}
                  className="w-10 h-10 rounded-lg border border-input flex items-center justify-center hover:bg-secondary text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                addedToCart
                  ? 'bg-primary text-primary-foreground'
                  : product.inStock
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {addedToCart ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added to Cart
                </span>
              ) : product.inStock ? (
                'Add to Cart'
              ) : (
                'Out of Stock'
              )}
            </button>

            {/* Product Info */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Product Information</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">SKU</dt>
                  <dd className="text-foreground font-medium">{product.id.slice(0, 8).toUpperCase()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Availability</dt>
                  <dd className={`${product.inStock ? 'text-foreground' : 'text-destructive'} font-medium`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">You May Also Like</h2>
              <Link to="/store" className="text-sm text-foreground hover:underline">
                View all →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  to={`/product/${relatedProduct.id}`}
                  className="group block"
                >
                  <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
                    <div className="relative bg-muted overflow-hidden" style={{ paddingBottom: '125%' }}>
                      <img 
                        src={getProductImage(relatedProduct)} 
                        alt={relatedProduct.name} 
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-semibold text-foreground">
                        ₦{relatedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;