"use client";

import OrderList from "@/components/Orders/OrderList";
import { IUserSession } from "@/interfaces";
import Cookies from "js-cookie";
import React from "react";

const Orders: React.FC = () => {
const userData: IUserSession = JSON.parse(Cookies.get("userData") || "{}");

  return (
    <div className="min-h-screen flex flex-col bg-[#b093bf]">
      <OrderList userToken={userData?.token} />
    </div>
  );
};

export default Orders;
