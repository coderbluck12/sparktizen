import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductGallery from './components/ProductGallery';
import NewsletterForm from './components/NewsletterForm';
import Footer from './components/Footer';
import AdminPage from './pages/admin';
import LoginPage from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';
import StorePage from './pages/store';
import CartPage from './pages/cart';
import ProductDetailPage from './pages/product/[id]';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <div className="min-h-screen">
          <main className="pb-24">
            <Routes>
              <Route path="/" element={<div className='bg-black text-white'><Header /><ProductGallery /><NewsletterForm /><Footer /></div>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
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
