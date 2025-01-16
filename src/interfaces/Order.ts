interface Address {
  id: string;
  street: string;
  number: number;
  postalCode: string;
  city: string;
  latitude: number; // Agregado
  longitude: number; // Agregado
}

interface Product {
  id: string;
  name: string;
  description: string;
  prices: number[];
  sizes: string[];
}

interface OrderDetail {
  address: Address;
  product: Product[];
  price: string;
  quantity: number;
  size: string;
}

interface Order {
  id: string;
  createdAt: string;
  total: number;
  orderDetail: OrderDetail; // Cambiado de string a OrderDetail
  status: string;
  updatedAt: string;
}

export default Order;
