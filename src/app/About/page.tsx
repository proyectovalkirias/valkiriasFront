import Image from "next/image";
import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white h-screen overflow-auto">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row h-auto md:h-1/3">
        {/* Left Section */}
        <div className="bg-custom-purple flex flex-col justify-center items-center overflow-hidden">
          <p className="text-white text-sm md:text-base lg:text-md xl:text-lg text-center max-w-screen-lg overflow-y-auto">
            <br />
            En Valkirias, creemos que tus prendas son una extensión de quién
            eres, por eso nos especializamos en crear diseños personalizados que
            se adaptan a tu estilo y personalidad. Somos madre e hija trabajando
            juntas en nuestro taller en casa, donde cada prenda se convierte en
            una pieza única hecha con amor y dedicación.
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
        {/* Rotated Text */}
        {/* <div className="bg-pink-200 p-4 flex items-center justify-center md:w-1/4">
          <p className="text-black text-xl md:text-3xl lg:text-3xl font-bold tracking-wider transform md:-rotate-90 text-center">
            SOBRE NOSOTROS
          </p>
        </div> */}
        <div className="bg-valkyrie-purple p-4 flex items-center justify-center md:w-1/4">
          <Image
            src="https://res.cloudinary.com/dwuxvipza/image/upload/v1736369135/Valki_yqz720.png"
            alt="Valki"
            className=" object-contain"
            width={200}
            height={200}
          />
        </div>

        {/* Description */}
        <div className="p-6 md:w-3/4 overflow-auto flex items-center justify-center bg-pink h-full max-w-full">
          <p className="text-purple-dark text-xs md:text-sm lg:text-base xl:text-lg text-center break-words max-h-full">
            Ofrecemos una amplia variedad de productos básicos, clásicos, sin
            género para vestir niños y adultos: remeras, buzos canguro, buzos
            con cuello redondo, tazas y gorras trucker, ideales para cualquier
            ocasión. Nos gusta que cada diseño sea un reflejo auténtico de lo
            que amas, ya sea para llevar a tu artista favorito, sorprender con
            un regalo especial, o vestir tu propia marca con un toque único.
            <br />
          </p>
        </div>

        <div className="bg-valkyrie-purple p-4 flex items-center justify-center md:w-1/4">
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

        {/* Goal Text */}
        <div className="flex-1 bg-purple-dark p-6 flex items-center justify-center overflow-y-auto h-full max-w-full">
          <p className="text-white text-xs md:text-sm lg:text-base xl:text-lg text-center break-words max-h-full">
            "Tu creatividad en tus prendas" es nuestro lema, porque queremos que
            te sientas cómodo y auténtico, sin importar la ocasión.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
