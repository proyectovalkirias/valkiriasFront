"use client";
import React, { useState, useEffect } from "react";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = [
          {
            id: 1,
            productName: "Remera estampada Shakira",
            status: "Pendiente de envío",
            description: "Remera estampa personalizada",
            image: "https://placehold.co/100x100",
          },
          {
            id: 2,
            productName: "Remera estampada negra",
            status: "Entregado",
            description: "Remera estampa personalizada",
            image: "https://placehold.co/100x100",
          },
          {
            id: 3,
            productName: "Remera estampada Shakira",
            status: "Entregado",
            description: "Remera estampa personalizada",
            image: "https://placehold.co/100x100",
          },
        ];

        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError("Hubo un problema al cargar las compras.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="md:w-3/3 p-6">
      <h1 className="text-4xl md:text-5xl mb-6 text-[#e5ded3]">Historial de compras</h1>

      {orders.length === 0 ? (
        <p>No tienes compras recientes.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="py-8">
            <div className="flex mb-6">
              <img
                src={order.image}
                alt={order.productName}
                className="w-24 h-24 mr-6"
              />
              <div>
                <h2 className="text-lg md:text-xl">
                  <a href="#" className="underline">
                    {order.productName}
                  </a>
                </h2>
                <p>{order.status}</p>
                <p>{order.description}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;

