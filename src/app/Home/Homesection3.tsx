import Image from "next/image";
import Link from "next/link";

const HomeSection3 = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center h-screen gap-10 lg:gap-16 bg-gray-100">
      {/* Imagen */}
      <div className="relative w-full lg:w-1/2 h-full">
        <Image
          src="/images/Homevalkirias.jpg"
          alt="Remera estampada personalizada"
          layout="fill"
          objectFit="cover"
          className="shadow-lg"
          priority
        />
      </div>

      {/* Texto */}
      <div className="text-center lg:text-left lg:w-1/2 max-w-[500px] px-6 lg:px-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          Estampados en remeras
        </h2>
        <p className="text-lg text-gray-800 mb-6">
          ¿Buscas algo único y divertido? Personaliza tus prendas con diseños
          especiales que reflejen tu estilo y humor.
        </p>
        <div className="sm:mb-16">
          <Link
            href={"/ProductDetail"}
            className="bg-creativity-purple text-black font-medium py-3 px-6 hover:bg-custom-purple transition"
          >
            COMPRA AHORA
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeSection3;
