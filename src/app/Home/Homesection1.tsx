import React from 'react';

const HomeSection1: React.FC = () => {
  return (
    <section
      id="Homesection1"
      className="h-screen flex-1 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/valkiriashirt.jpg')" }}
    >
      {/* Logo y texto arriba a la izquierda */}
      <div className="absolute top-10 left-10">
        <img
          src="/images/valkiriaslogo.jpg"
          alt="Logo de Valkirias"
          className="h-20 w-auto object-contain"
        />
        <p className="text-lg text-creativity-purple mt-2">
          Tu creatividad en tus prendas
        </p>
      </div>
    </section>
  );
};

export default HomeSection1;
