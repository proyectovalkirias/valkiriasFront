
import React from 'react';

const HomeSection1: React.FC = () => {
  return (
    <>
    <section
    id='Homesection1'
    className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
    style={{ backgroundImage: "url('/images/valkiriashirt.jpg')" }}
    >
      <div className="p-6 rounded-lg">
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

      </div>
    </section>
  </>
  );
};

export default HomeSection1;
