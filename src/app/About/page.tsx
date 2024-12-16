import React from "react";

const AboutUs: React.FC = () => {
  return (
    <section className="bg-[#7b548b] text-white py-16 px-6 h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 ">Sobre Nosotros</h2>
        <p className="text-lg leading-relaxed mb-6">
          En <span className="font-semibold ">VALKIRIAS</span>, no somos solo
          otra
          <span className="font-semibold text-white"> marca de productos</span>.
          Estamos aquí para romper esquemas, ofreciendo
          <span className="italic"> soluciones innovadoras</span> y experiencias
          inolvidables.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <div className="w-64  rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2 ">Nuestra Misión</h3>
            <p className="text-sm">
              Empoderarte con herramientas, conocimiento y estilo para destacar
              en cada paso de tu camino.
            </p>
          </div>
          <div className="w-64 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Nuestro Equipo</h3>
            <p className="text-sm">
              Un grupo de apasionados creadores, innovadores y soñadores con una
              visión común de excelencia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
