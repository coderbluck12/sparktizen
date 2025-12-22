import React from 'react';

const products = [
  { id: 1, src: '/green.png', alt: 'Camo shirt' },
  { id: 2, src: '/red.png', alt: 'Red and blue jersey' },
  { id: 3, src: '/green.png', alt: 'Red and black long-sleeve' },
  { id: 4, src: '/red.png', alt: 'Black long-sleeve' },
  { id: 5, src: '/green.png', alt: 'T-shirts and accessories' },
  { id: 6, src: '/red.png', alt: 'Denim jeans' },
  { id: 7, src: '/green.png', alt: 'Graphic t-shirts' },
];

const ProductGallery: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 md:gap-6 mb-6">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="flex items-center justify-center">
              <img src={product.src} alt={product.alt} className="w-40 h-40 object-contain" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 md:gap-6">
          {products.slice(4, 7).map((product) => (
            <div key={product.id} className="flex items-center justify-center">
              <img src={product.src} alt={product.alt} className="w-40 h-40 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGallery;
