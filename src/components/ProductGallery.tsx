import { Link } from 'react-router-dom';
import Header from './Head';

const HomePage = () => {

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Header />

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
              <p className="text-xl sm:text-2xl text-primary-foreground mb-8 leading-relaxed">
                Discover our curated collection of premium products designed for those who dare to stand out.
              </p>
              <Link
                to="/store"
                className="inline-block px-8 py-4 bg-primary-foreground text-primary text-lg font-semibold rounded-lg hover:bg-secondary transition-colors shadow-lg"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className='text-center pt-2 text-muted-foreground'>2025 Spartizen. All right reserved</div>
      </footer>
    </div>
  );
};

export default HomePage;