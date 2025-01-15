import { useEffect, useState } from "react";
import axios from "axios";
import Map from "./Map";

const OrderDetails: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const getTokenAndUserId = () => {
          const user = localStorage.getItem("user");
          if (!user) return null;

          try {
            const parsedUser = JSON.parse(user);
            return { token: parsedUser.token, id: parsedUser.user?.id };
          } catch (err) {
            console.error("Error al parsear los datos del usuario:", err);
            return null;
          }
        };
        const { token, id: userId } = getTokenAndUserId() || {};
        if (!token || !userId) {
          setError("No se encontró el token o el id del usuario.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `http://localhost:3000/order/user/${userId}`,
          { headers }
        );
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching user orders:", err);
        setError("Hubo un error al cargar las órdenes.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (orders.length === 0) {
    return <p>No hay órdenes disponibles para este usuario.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Órdenes del Usuario
      </h1>
      {orders.map((order) => (
        <div
          key={order.id}
          className="mb-6 p-4 border border-gray-200 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-gray-700">
            Orden ID: {order.id}
          </h2>
          <p>Status: {order.status}</p>
          <p>{order.coordinates.description}</p>
          <Map
            latitude={order.coordinates.latitude}
            longitude={order.coordinates.longitude}
          />
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
