import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white h-screen md:h-screen overflow-auto">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row h-auto md:h-1/3">
        {/* Left Section */}
        <div className="flex-1 bg-pink-300 p-4 flex flex-col justify-center items-center">
          <p className="text-white text-center text-sm md:text-lg lg:text-xl">
            Bienvenido a VALKIRIAS,
            <br />
            ¡donde la moda se encuentra con la personalización!
            <br />
            Descubrí una amplia variedad de remeras, buzos y accesorios que podés
            personalizar a tu estilo.
            <br />
            Nuestro objetivo es ofrecerte opciones únicas para expresar tu personalidad
            a través de prendas diseñadas especialmente para vos.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 relative h-40 md:h-full">
          <img
            src="/images/love.jpg"
            alt="Dos mujeres acostadas, mirando hacia la cámara"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* About Section */}
      <div className="flex flex-col md:flex-row h-auto md:h-2/5">
        {/* Rotated Text */}
        <div className="bg-pink-200 p-4 flex items-center justify-center md:w-1/4">
          <p className="text-black text-xl md:text-3xl lg:text-5xl font-bold tracking-wider transform md:-rotate-90 text-center">
            SOBRE NOSOTROS
          </p>
        </div>

        {/* Description */}
        <div className="p-4 md:w-3/4 overflow-auto flex items-center justify-center bg-pink">
          <p className="text-black text-xs md:text-sm lg:text-base text-center">
            Desde 2011, Valkirias ha estado ayudando a las personas, jóvenes y adultos,
            a expresar su estilo único con prendas personalizadas. Ofrecemos una amplia
            variedad de remeras, buzos y accesorios que podés personalizar con estampados,
            colores y diseños exclusivos. 
            <br />
            <br />
            Creemos en la importancia de la moda como una forma de expresión personal,
            y estamos aquí para ayudarte a encontrar la prenda perfecta que hable sobre ti.
            Nuestras colecciones incluyen eventos especiales y colaboraciones con diseñadores
            emergentes para ofrecerte siempre lo último en tendencias y estilo personalizado.
          </p>
        </div>

        <div className="bg-pink-200 p-4 flex items-center justify-center md:w-1/4">
          <img
            src="/images/valkiriaslogo.jpg"
            alt="Logo de Valkirias"
            className="h-16 md:h-20 w-auto object-contain"
          />
        </div>
      </div>

      {/* Goal Section */}
      <div className="flex flex-col md:flex-row h-auto md:h-1/3">
        {/* Image Section */}
        <div className="flex-1 relative h-40 md:h-full">
          <img
            src="/images/valkiriashirt.jpg"
            alt="Mujer de cabello oscuro, mirando hacia abajo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Goal Text */}
        <div className="flex-1 bg-purple-300 p-4 flex items-center justify-center">
          <p className="text-white text-xs md:text-sm lg:text-base text-center">
            Nuestro objetivo es permitirte personalizar tus compras y crear piezas únicas
            que te representen. Con Valkirias, podés transformar tus prendas en algo
            verdaderamente especial, con estampados personalizados y diseños únicos.
            Creemos que cada prenda debe contar una historia y ser un reflejo de quien eres,
            por eso trabajamos para ofrecerte la máxima calidad y variedad para que puedas
            expresar tu estilo sin límites.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;