import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Order {
  id: string;
  createdAt: string;
  status: string;
}

const Tracking: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "https://valkiriasback.onrender.com"; // Cambia esta URL si es necesario

  const getUserTokenId = (): { id: string; token: string } => {
    const user = localStorage.getItem("user");

    if (!user) {
      return { id: "", token: "" };
    }

    try {
      const parsedUser = JSON.parse(user);
      const id = parsedUser.id || parsedUser.user?.id || "";
      const token = parsedUser.token || parsedUser.accessToken || "";
      return { id, token };
    } catch (err) {
      console.error("Error al parsear los datos del usuario:", err);
      return { id: "", token: "" };
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const { id, token } = getUserTokenId();

      if (!id || !token) {
        throw new Error("Usuario no autenticado");
      }

      const response = await axios.get(`${API_URL}/order/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Error al obtener las órdenes.");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { token } = getUserTokenId();

      if (!token) {
        throw new Error("Usuario no autenticado");
      }

      await axios.delete(`${API_URL}/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      toast.success("Orden eliminada con éxito.");
    } catch (err: any) {
      toast.error("Error al eliminar la orden.");
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const validStatuses = [
      "pendiente",
      "en preparación",
      "en camino",
      "entregado",
    ];

    if (!validStatuses.includes(newStatus)) {
      toast.error("Estado inválido.");
      return;
    }

    try {
      const { token } = getUserTokenId();

      if (!token) {
        throw new Error("Usuario no autenticado");
      }

      await axios.put(
        `${API_URL}/order/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Estado de la orden actualizado con éxito.");
    } catch (err: any) {
      console.error("Error al actualizar el estado:", err);
      toast.error("Error al actualizar el estado de la orden.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Estados de Órdenes
      </h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">
          No tienes órdenes registradas.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  ID: {order.id}
                </p>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Estado: {order.status}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateOrderStatus(order.id, "pendiente")}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Pendiente
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "en preparación")}
                  className="px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-600"
                >
                  En Preparación
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "en camino")}
                  className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                >
                  En Camino
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "entregado")}
                  className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  Entregado
                </button>
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tracking;
