"use client";
import React, { useEffect, useState } from "react";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return <div>Usuario no autenticado.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-5xl text-[#e5ded3] mb-6">Mi perfil</h1>

      <img
        src={user.photoUrl || "/images/Avatar.png"}
        alt="Profile emoji"
        className=" border-b-2 w-[140px] md:w-[170px] lg:w-[200px] mb-2"
      />

      <div className="text-base md:text-xl mt-6">
        <h2 className="font-semibold mb-6 ">Info personal</h2>
      </div>
        <div className="text-base md:text-xl mr-32">
          <p className="mb-2">
            Nombre: <span className="font-light">{user.firstname}</span>
          </p>
          <p className="mb-2">
            Apellido: <span className="font-light">{user.lastname}</span>
          </p>
          <p className="mb-2">
            Email: <span className="font-light">{user.email}</span>
          </p>
        </div>
    </div>
  );
};

export default Profile;
