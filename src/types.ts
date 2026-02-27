export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUSD?: number;
  imageUrl?: string;
  imageUrls?: string[];
  inStock: boolean;
}
