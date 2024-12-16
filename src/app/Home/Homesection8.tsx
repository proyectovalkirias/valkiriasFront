"use client";
import React from "react";
import Image from "next/image";

const HomeSection8: React.FC = () => {
  // Función para hacer scroll hacia la sección 1
  const scrollToHomeSection1 = () => {
    const homeSection1 = document.getElementById("Homesection1");
    if (homeSection1) {
      homeSection1.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('/images/love.jpg')" }}
    >
      {/* Logo Valkirias */}
      <button
        className="absolute top-6 left-6 md:top-8 md:left-8 p-2 bg-opacity-50 rounded-md"
        onClick={scrollToHomeSection1}
        aria-label="Ir al inicio"
      >
        <Image
          src="/images/valkiriaslogo.jpg"
          alt="Logo Valkirias"
          width={150}
          height={80}
          priority
        />
      </button>

      {/* Información de contacto y QR */}
      <div className="absolute bottom-6 w-full px-6 sm:px-12 md:px-16 flex justify-between items-center flex-col sm:flex-row">
        {/* Código QR y Ubicación */}
        <div className="flex flex-col items-center text-white space-y-4 sm:space-y-2 sm:items-start">
          <div className="flex justify-center items-center">
            <Image
              src="/images/qrvalkiria.jpg"
              alt="QR Code Valkirias"
              width={100}
              height={100}
              className="shadow-md"
              priority
            />
          </div>
          <p className="text-lg text-black">Buenos Aires, Argentina</p>
        </div>

        {/* Información de contacto */}
        <div className="flex flex-col items-start text-left space-y-2 text-white sm:space-y-0">
          <p className="text-creativity-purple text-lg">+54 9 11 3313-2418</p>
          <p className="text-lg">
            <a
              href="mailto:valkirias.personalizados@gmail.com"
              className="text-creativity-purple hover:underline"
              aria-label="Enviar un correo a Valkirias"
            >
              valkirias.personalizados@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeSection8;
