export interface Product {
  quantity?: number;
  id: string;
  name: string;
  description: string;
  prices: number[];
  size: string[];
  category: string;
  photos: string[];
  stock: number;
  color: string[];
  smallPrint: string[];
  largePrint: string[];
  isAvailable?: boolean;
}
