"use client";
import { getOrders } from "@/helpers/order";
import { IUserOrder } from "@/interfaces/index";
import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";


interface OrderListProps {
  userToken: string;
}

const OrderList: React.FC<OrderListProps> = ({ userToken }) => {
  const [userOrders, setUserOrders] = useState<IUserOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const orders = await getOrders(userToken);
        setUserOrders(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userToken) {
      fetchOrders();
    }
  }, [userToken]);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto my-20 flex flex-col">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Your Order History
      </h2>

      <div className="flex-grow grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-gray-900" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : userOrders.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            <img
              src="/images/EmptyBox.png"
              alt="Empty orders illustration"
              className="w-96 h-96 mx-auto mb-6 object-contain"
            />
            <p className="text-lg">Order history is empty.</p>
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
