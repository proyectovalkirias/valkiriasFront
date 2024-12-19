import React from "react";

const AboutUs: React.FC = () => {
  return (
    <section className="h-screen grid grid-cols-1 md:grid-cols-2 grid-rows-3 md:grid-rows-2 gap-4">
      {/* Sección Izquierda Superior */}
      <div className="bg-pink-200 flex items-center justify-center text-center p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Bienvenido a <span className="text-purple-600">VALKIRIAS</span>
        </h1>
      </div>

      {/* Imagen Superior Derecha */}
      <div
        className="bg-cover bg-center h-full"
        style={{ backgroundImage: "url('/images/valkiriashirt.jpg')" }}
      >
        {/* Imagen decorativa */}
      </div>

      {/* Título "Sobre Nosotros" */}
      <div className="bg-pink-300 flex items-center justify-center rotate-90 md:rotate-0">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Sobre Nosotros
        </h2>
      </div>

      {/* Texto principal */}
      <div className="bg-white p-6 text-gray-700 row-span-2">
        <p className="text-sm md:text-base leading-relaxed">
          En <span className="font-bold">VALKIRIAS</span>, estamos comprometidos
          con el cambio. Desde 2020, hemos creado
          <span className="italic"> experiencias únicas</span> para transformar
          el día a día de las mujeres. Nuestro objetivo es proporcionar
          herramientas, conocimientos y productos que inspiren confianza y
          estilo.
        </p>
        <p className="mt-4 text-sm md:text-base">
          Nuestro equipo está formado por visionarios apasionados que creen en
          un futuro inclusivo y empoderado. Juntos, estamos aquí para redefinir
          los estándares.
        </p>
      </div>

      {/* Imagen Inferior Izquierda */}
      <div
        className="bg-cover bg-center h-100 md:h-full"
        style={{ backgroundImage: "url('/images/love.jpg')" }}
      ></div>
    </section>
  );
};

export default AboutUs;
