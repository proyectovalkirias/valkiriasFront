export interface Price {
  size: string;
  price: number;
}

export interface Product {
  quantity?: number;
  id: string;
  name: string;
  description: string;
  prices: Price[];
  priceAdults: Price[];
  priceKids:Price[];
  sizes: string[];
  category: string;
  photos: string[];
  stock: number;
  color: string[];
  smallPrint: string[];
  largePrint: string[];
  isAvailable?: boolean;
}

export interface CartItem {
  product: Product;
  id: string;
  name: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  selectedLargePrint: string;
  selectedSmallPrint: string;
  totalPrice: number;
}
