import { ICreateOrder, IUserOrder } from "@/interfaces/index";

// URL base de la API
const API_BASE_URL = "http://localhost:3000/order";

// Obtener todas las órdenes del usuario
export const getOrders = async (userToken: string): Promise<IUserOrder[]> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching orders");
  }

  return response.json();
};

// Crear una nueva orden
export const createOrder = async (orderData: ICreateOrder): Promise<IUserOrder> => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error("Error creating order");
  }

  return response.json();
};

// Obtener detalles de una orden por ID
export const getOrderById = async (orderId: string): Promise<IUserOrder> => {
  const response = await fetch(`${API_BASE_URL}/${orderId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Error fetching order details");
  }

  return response.json();
};

// Eliminar una orden por ID
export const deleteOrder = async (orderId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${orderId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error deleting order");
  }
};
