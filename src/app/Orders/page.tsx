"use client";

import OrderCard from "@/components/Orders/OrderCard";
import { getOrders } from "@/helpers/order";
import { IUserOrder } from "@/interfaces/index";
import { useEffect, useState } from "react";

const Orders: React.FC = () => {
  const [userOrders, setUserOrders] = useState<IUserOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const userToken = localStorage.getItem("access_token") || "";
        if (!userToken) {
          setError("User token is missing. Please log in.");
          setLoading(false);
          return;
        }

        const orders = await getOrders(userToken);
        setUserOrders(orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto flex flex-col bg-[#7b548b] min-h-screen overflow-hidden">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Historial de compras
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">cargando tu historial...</p>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="flex-grow grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {userOrders.length === 0 ? (
            <div className="col-span-full text-center text-gray-300">
              <img
                src="/images/EmptyBox.png"
                alt="Empty orders illustration"
                className="w-60 h-60 mx-auto mb-6 object-contain sm:w-96 sm:h-96"
              />
              <p className="text-lg ">Historial de compras vacio.</p>
            </div>
          ) : (
            userOrders.map((order) => (
              <div key={order.id} className="max-w-xs mx-auto">
                <OrderCard order={order} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
