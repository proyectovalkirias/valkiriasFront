import Image from "next/image";

const HomeSection4 = () => {
  return (
    <section className="flex flex-col lg:flex-row-reverse items-center h-screen gap-10 lg:gap-16 bg-gray-100">
      {/* Imagen */}
      <div className="relative w-full lg:w-1/2 h-full">
        <Image
          src="/images/Remeraniñovalkiria.jpg"
          alt="Remera niño"
          fill
          className="object-cover shadow-lg"
          priority
        />
      </div>

      {/* Texto */}
      <div className="text-center lg:text-left lg:w-1/2 max-w-[500px] px-6 lg:px-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
        Estampados para niños
        </h2>
        <p className="text-lg text-gray-800 mb-6">
        Dale vida a la ropa de tus pequeños con diseños únicos y llenos de magia. ¡Hacemos de cada prenda un mundo de imaginación!
        </p>
        <button className="bg-creativity-purple text-black font-medium py-3 px-6 hover:bg-custom-purple transition">
          COMPRA AHORA
        </button>
      </div>
    </section>
  );
};

export default HomeSection4;
