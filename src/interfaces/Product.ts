
export interface Product {
  quantity?: number;
  id: string;
  name: string;
  description: string;
  prices: string[];
  priceAdults: string[];
  priceKids:string[]
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
