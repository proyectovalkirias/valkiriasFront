import React from "react";
import Profile from "./page";
import Orders from "./Orders/page";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#b093bf] py-12 md:py-20 justify-center items-center">
      <div className="md:w-1/3 p-6">
        <Profile />
      </div>
      <div className="h-1 bg-gray-300 md:hidden"></div>
      <div className="flex justify-center md:w-2/3 p-6">
        <div className="w-full max-w-3xl">
          <Orders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
