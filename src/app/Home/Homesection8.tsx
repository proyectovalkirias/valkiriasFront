"use client"
import React from 'react';
import Image from 'next/image';

const HomeSection8: React.FC = () => {
  const scrollToHomeSection1 = () => {
    const homeSection1 = document.getElementById('Homesection1');
    if (homeSection1) {
      homeSection1.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('/images/love.jpg')" }}
    >
      {/* Logo Valkirias */}
      <button
        className="absolute top-8 right-8"
        onClick={scrollToHomeSection1}
      >
        <Image
          src="/images/valkiriaslogo.jpg"
          alt="Logo Valkirias"
          width={150}
          height={80}
          priority
        />
      </button>

      {/* Footer Info */}
      <div className="absolute bottom-8 w-full flex justify-between px-12">
        {/* Contact Info */}
        <div className="flex flex-col items-start text-left space-y-2">
          <p className="text-creativity-purple text-lg">+54 9 11 3313-2418</p>
          <p className="text-gray-800 text-lg">
            <a
              href="mailto:valkirias.personalizados@gmail.com"
              className="text-creativity-purple hover:underline"
            >
              valkirias.personalizados@gmail.com
            </a>
          </p>
        </div>

        {/* QR Code + Location */}
        <div className="text-right">
          <div className="flex flex-col items-center">
            <Image
              src="/images/qrvalkiria.jpg"
              alt="QR Code Valkirias"
              width={100}
              height={100}
              className="shadow-md"
              priority
            />
            <p className="text-gray-800 text-lg mt-2">Buenos Aires, Argentina</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection8;
