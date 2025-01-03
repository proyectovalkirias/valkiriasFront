"use client";

import OrderList from "@/components/Orders/OrderList";
import { IUserSession } from "@/interfaces";
import Cookies from "js-cookie";
import React from "react";

const Orders: React.FC = () => {
const userData: IUserSession = JSON.parse(Cookies.get("userData") || "{}");

  return (
    <div className="bg-valkyrie-purple">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Your Order History
      </h2>

      <div className="flex-grow grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
       
          <div className="col-span-full text-center text-gray-500">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-gray-900" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
          
          <div className="col-span-full text-center text-gray-500">
            <img
              src="https://i.pinimg.com/736x/b6/8a/bd/b68abd5a13b62a30170409f0e0ad9027.jpg"
              alt="Empty orders illustration"
              className="w-96 h-96 mx-auto mb-6 object-contain"
            />
            <p className="text-lg">Order history is empty.</p>
          </div>
      </div>
    </div>
  );
};

export default OrderList;