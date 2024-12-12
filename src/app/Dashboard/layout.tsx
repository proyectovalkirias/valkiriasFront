import React from "react";
import Profile from "./page";
import Orders from "./Orders/page";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#b093bf]">
      <div className="flex flex-col justify-center items-center  md:w-1/4 h-full p-6 border-r-2 border-gray-300">
        <Profile />
      </div>

      <div className="flex justify-center items-center md:w-2/3 p-6">
        <div className="w-full max-w-3xl">
          <Orders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
