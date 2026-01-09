import React from 'react';
import type { Product } from '../../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Helper function to safely get product image
  const getProductImage = (): string => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }
    return product.imageUrl || 'https://via.placeholder.com/400?text=No+Image';
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
      {/* Image Container - Fixed aspect ratio */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative bg-secondary overflow-hidden group" style={{ paddingBottom: '125%' }}>
          <img 
            src={getProductImage()} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="mb-3">
          <span className="text-lg font-semibold text-foreground">
            ₦{product.price.toFixed(2)}
          </span>
        </div>
        <Link 
          to={`/product/${product.id}`}
          className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;