import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { cartItems } = cartContext;
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Sparktizen</h1>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-800 text-white">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link 
              to="/store" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Shop
            </Link>
            
            {/* Cart Icon with Badge */}
            <Link 
              to="/cart" 
              className="relative flex items-center text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;