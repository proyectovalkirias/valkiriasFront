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
  sizes: string[];
  category: string;
  photos: string[];
  stock: number;
  color: string[];
  smallPrint: string[];
  largePrint: string[];
  isAvailable?: boolean;
  isCustomizable?: boolean;
  imagePrint?: string | null;
  ideas?: string | null;
}

export interface CartItem {
  product: Product;
  id: string;
  name: string;
  quantity: number;
  size: string;
  selectedColor: string;
  selectedSize: string;
  selectedLargePrint: string;
  selectedSmallPrint: string;
  totalPrice: number;
  clientIdeas: string;
  uploadedImage: string;
}
