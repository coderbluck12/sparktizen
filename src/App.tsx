import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductGallery from './components/ProductGallery';
import AdminPage from './pages/admin';
import LoginPage from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';
import StorePage from './pages/store';
import CartPage from './pages/cart';
import ProductDetailPage from './pages/product/[id]';
import ProductList from './pages/admin/products';
import EditProductPage from './pages/admin/products/edit/[id]';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <div className="min-h-screen">
          <main className="pb-4">
            <Routes>
              <Route path="/" element={<ProductGallery />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
              <Route path="/admin/products/edit/:id" element={<ProtectedRoute><EditProductPage /></ProtectedRoute>} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
