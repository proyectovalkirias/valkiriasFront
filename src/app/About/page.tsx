import Image from "next/image";
import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white h-screen overflow-auto">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row h-auto md:h-1/3">
        <div className="flex-1 bg-pink-300 p-6 flex flex-col justify-center items-center">
          <h2 className="text-white text-lg md:text-xl lg:text-2xl font-bold text-center">
            ¡Bienvenido a Valkirias!
          </h2>
          <p className="text-white text-sm md:text-base text-center max-w-screen-lg mt-2">
            Moda y personalización en un solo lugar. Diseña tus prendas con
            estilo único.
          </p>
        </div>
        <div className="flex-1 relative h-40 md:h-full">
          <Image
            src="/images/love.jpg"
            alt="Dos mujeres acostadas, mirando hacia la cámara"
            className="w-full h-full object-cover"
            fill
          />
        </div>
      </div>

      {/* About Section */}
      <div className="flex flex-col md:flex-row h-auto md:h-2/5">
        <div className="bg-pink-200 p-4 flex items-center justify-center md:w-1/4">
          <p className="text-black text-2xl font-bold tracking-wider transform md:-rotate-90 text-center">
            SOBRE NOSOTROS
          </p>
        </div>
        <div className="p-6 md:w-3/4 flex items-center justify-center bg-pink h-full">
          <ul className="text-black text-sm md:text-base text-center space-y-2">
            <li>
              🌟 Desde 2022 ayudando a jóvenes y adultos a expresar su estilo.
            </li>
            <li>
              👕 Personaliza remeras, buzos y accesorios con tus diseños
              favoritos.
            </li>
            <li>🛍️ Tendencias exclusivas y colaboraciones únicas.</li>
          </ul>
        </div>
        <div className="bg-pink-200 p-4 flex items-center justify-center md:w-1/4">
          <Image
            src="/images/valkiriaslogo.jpg"
            alt="Logo de Valkirias"
            className="object-contain"
            width={150}
            height={150}
          />
        </div>
      </div>

      {/* Goal Section */}
      <div className="flex flex-col md:flex-row h-auto md:h-1/3">
        <div className="flex-1 relative h-40 md:h-full">
          <Image
            src="/images/valkiriashirt.jpg"
            alt="Mujer de cabello oscuro, mirando hacia abajo"
            className="w-full h-full object-cover"
            fill
          />
        </div>
        <div className="flex-1 bg-purple-400 p-6 flex items-center justify-center">
          <p className="text-white text-sm md:text-base text-center">
            Transformá tus prendas en piezas únicas. Diseños personalizados para
            contar tu historia. ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
