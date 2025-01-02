import Image from "next/image";
import Link from "next/link";

const HomeSection5 = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center h-screen gap-10 lg:gap-16 bg-gray-100 px-6 py-8">
      {/* Imagen */}
      <div className="relative w-full lg:w-1/2 h-72 lg:h-full">
        <Image
          src="/images/tazavalkiria.jpg"
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
          Accesorios
        </h2>
        <p className="text-lg text-gray-800 mb-6">
          ¡Es hora de inspirarse y crear! Personalizamos tus productos con amor
          y dedicación. Tenemos remeras, gorros de lana, gorras Trucker, buzos,
          tazas y más.
        </p>
        <div className="sm:mb-16">
          <Link
            href={{
              pathname: "/Products",
              query: { category: "accesorios" },
            }}
            className="bg-creativity-purple text-black font-medium py-3 px-6 hover:bg-custom-purple transition"
          >
            COMPRA AHORA
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeSection5;
