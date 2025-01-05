"use client";
import React, { useEffect, useState } from "react";
import AddressesLocal from "@/components/AddressesLocal";
import AddressesGoogle from "@/components/AddressesGoogle";

function Addresses() {
  const [isGoogleUser, setIsGoogleUser] = useState<boolean | null>(null);

  useEffect(() => {
    // Comprobar si el usuario se registró con Google o de forma local
    const userInfo = localStorage.getItem("user_info");
    const userLocal = localStorage.getItem("user");

    // Si existe "user_info", es un usuario de Google. Si existe "user", es un usuario local.
    if (userInfo) {
      setIsGoogleUser(true); // Usuario de Google
    } else if (userLocal) {
      setIsGoogleUser(false); // Usuario local
    }
  }, []);

  // Mientras no sepamos si el usuario es de Google o local, mostramos un loading o vacío
  if (isGoogleUser === null) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-[#7b548b] min-h-screen p-8">
      {isGoogleUser ? <AddressesGoogle /> : <AddressesLocal />}
    </div>
  );
}

export default Addresses;
