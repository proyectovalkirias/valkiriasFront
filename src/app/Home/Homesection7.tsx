import Image from "next/image";

const HomeSection7 = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center h-screen gap-10 lg:gap-16 bg-gray-100 px-6 py-8">
      {/* Imagen */}
      <div className="relative w-full lg:w-1/2 h-72 lg:h-full">
        <Image
          src="/images/Valkiriaremera.jpg"
          alt="Taza estampada personalizada"
          fill
          objectFit="cover"
          className="shadow-lg rounded-lg"
          priority
        />
      </div>

      {/* Texto */}
      <div className="text-center lg:text-left lg:w-1/2 max-w-[500px] px-6 lg:px-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          ¿Por qué elegir las prendas personalizadas de VALKIRIAS?
        </h2>
        <ul className="text-lg text-gray-800 mb-6 list-disc list-inside">
          <li>Tenemos envíos a todo el país.</li>
          <li>
            Tabla de talles disponibles para que puedas elegir la prenda justa
            para vos.
          </li>
          <li>Asesoramiento personalizado para cada una de tus consultas.</li>
          <li>Apoyamos los pagos sin contacto y el pago en efectivo.</li>
        </ul>
        <div className="flex justify-between items-center">
          {/* Columna izquierda */}
          <div className="flex flex-col items-start text-left gap-2 ">
            <p className="text-black text-md">Contacto:</p>
            <p className="text-black text-md">+54 9 11 3313-2418</p>
            <p className="text-md">
              <a
                href="mailto:valkirias.personalizados@gmail.com"
                className="text-black hover:underline"
                aria-label="Enviar un correo a Valkirias"
              >
                valkirias.personalizados@gmail.com
              </a>
            </p>
            <p className="text-md text-black">Buenos Aires, Argentina</p>
          </div>

          {/* Columna derecha */}
          <div className=" ">
            <Image
              src="/images/qrvalkiria.jpg"
              alt="QR Code Valkirias"
              width={200}
              height={200}
              className="shadow-md ml-4"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection7;
