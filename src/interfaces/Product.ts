export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sizes: string[];
  category: string;
  photos: string[];
  stock: number;
  color: string;
  stamped?: string[];
}
