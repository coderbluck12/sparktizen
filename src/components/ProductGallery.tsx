import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const HomePage = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { cartItems } = cartContext;
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-gray-900">Sparktizen</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/store" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Store
              </Link>
              
              {/* Cart Icon */}
              <Link 
                to="/cart" 
                className="relative flex items-center text-gray-700 hover:text-blue-600 transition-colors"
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section / Cover Photo */}
      <div className="relative h-screen">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {/* Mobile Image */}
          <img
            src="/mobile.jpg"
            alt="Hero background"
            className="md:hidden w-full h-full object-cover"
          />
          {/* Desktop Image */}
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt="Hero background"
            className="hidden md:block w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Elevate Your Style
              </h1>
              <p className="text-xl sm:text-2xl text-gray-200 mb-8 leading-relaxed">
                Discover our curated collection of premium products designed for those who dare to stand out.
              </p>
              <Link
                to="/store"
                className="inline-block px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className='text-center pt-2'>2025 Spartizen. All right reserved</div>
      </footer>
    </div>
  );
};

export default HomePage;