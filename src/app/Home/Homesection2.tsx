import React from 'react';

const HomeSection2: React.FC = () => {
  return (
    <section className="bg-[#7b548b] h-screen flex items-center justify-center text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8 px-4">
        {/* Texto del lado izquierdo */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold leading-snug">
            ¡Es hora de inspirarse y crear!
          </h1>
        </div>

        {/* Texto del lado derecho */}
        <div className="flex flex-col justify-center">
          <p className="text-2xl mb-4">
            En <span className="text-custom-orange font-bold">VALKIRIAS</span> estampamos tus ideas donde imagines
          </p>
          <p className="text-lg mt-4">¡Envíos a todo el país!</p>
        </div>
      </div>
    </section>
  );
};

export default HomeSection2;
