"use client";
import { getOrders } from "@/helpers/order";
import { IUserOrder } from "@/interfaces";
import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import Image from "next/image";

interface OrderListProps {
  userToken: string;
}

const OrderList: React.FC<OrderListProps> = ({ userToken }) => {
  const [userOrders, setUserOrders] = useState<IUserOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getOrders(userToken);
        setUserOrders(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    if (userToken) {
      fetchOrders();
    }
  }, [userToken]);

  return (
    <div className="p-6 rounded-lg max-w-screen-2xl mx-auto my-20 flex flex-col">
      <h2 className="text-4xl font-bold text-[#e5ded3] text-center mb-8">
        Historial de compras
      </h2>

      <div className="flex-grow grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {userOrders.length === 0 ? (
          <div className="col-span-full text-center text-[#c7b7cd]">
            <Image
                src="/images/EmptyBox.png"
                alt="Empty orders illustration"
                width={384}
                height={384}
                className="w-96 h-96 mx-auto object-contain"
            />
            <p className="text-lg ">Aún no has comprado nada!</p>
          </div>
        ) : (
          userOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;

