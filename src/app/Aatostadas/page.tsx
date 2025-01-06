"use client"
import React from "react";
import { toast, ToastContainer } from "react-toastify";

const App = () => {
  const showToast = () => {
    toast("¡Hola! Este es un mensaje de notificación.");
  };

  const showNotifications = () => {
    toast.info("Esto es una notificación informativa");
    toast.success("Operación completada con éxito");
    toast.warning("¡Cuidado con este mensaje!");
    toast.error("Ocurrió un error inesperado");
  };

  return (
    <div>
      <h1>React-Toastify Tutorial</h1>
      <button onClick={showToast}>BOTON Notificación</button>
      <br/>
      <button onClick={showNotifications}>BOTON si no blanco negro</button>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default App;
