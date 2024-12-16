import React from 'react';

const HomeSection2: React.FC = () => {
  return (
    <section className="bg-[#7b548b] h-screen flex items-center justify-center text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 px-4">
        {/* Texto del lado izquierdo */}
        <div className="flex flex-col justify-center text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold leading-snug">
            ¡Es hora de inspirarse y crear!
          </h1>
        </div>

        {/* Texto del lado derecho */}
        <div className="flex flex-col justify-center text-center sm:text-left">
          <p className="text-xl sm:text-2xl mb-4">
            <span className="text-black">En </span>
            <span className="text-custom-orange font-bold">VALK</span>
            <span className="text-custom-purple">IRIAS </span>
            <span className="text-black">estampamos tus ideas donde imagines </span>
          </p>
          <p className="text-lg sm:text-xl mt-4 text-black">¡Envíos a todo el país!</p>
        </div>
      </div>
    </section>
  );
};

export default HomeSection2;
