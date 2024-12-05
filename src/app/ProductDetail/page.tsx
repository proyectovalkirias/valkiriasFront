"use client";

import { useState } from "react";

interface IProductDetailProps {
  params: {
    id: string;
  };
}
interface IProduct {
  name: string;
  description: string;
  price: number;
  sizes: string[];
  category: string;
}

const ProductDetail: React.FC = async () => {
  const [ideas, setIdeas] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const handleAddToCart = () => {};

  return (
    <div className="h-screen bg-purple-100 flex  items-center py-8 px-4">
      <div className="flex mx-16 gap-4 h-[600px] w-1/2">
        <div className="flex flex-col gap-4 w-1/2">
          <img
            src="https://th.bing.com/th/id/R.d73839efa381d261e544ece6dea8c7f4?rik=F3331MdhrEa2SA&pid=ImgRaw&r=0"
            alt="Remera 1"
            className="object-cover rounded-lg w-full h-1/2"
          />
          <img
            src="https://th.bing.com/th/id/R.d73839efa381d261e544ece6dea8c7f4?rik=F3331MdhrEa2SA&pid=ImgRaw&r=0"
            alt="Remera 2"
            className="object-cover rounded-lg w-full h-1/2"
          />
        </div>

        <div className="w-1/2">
          <img
            src="https://th.bing.com/th/id/R.d73839efa381d261e544ece6dea8c7f4?rik=F3331MdhrEa2SA&pid=ImgRaw&r=0"
            alt="Remera 3"
            className="object-cover rounded-lg w-full h-full"
          />
        </div>
      </div>

      <div className="w-1/2 max-w-4xl   text-center p-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          Remera unisex para estampa
        </h1>
        <p className="text-lg text-gray-800 mb-6">
          Nosotros seguimos trabajando en cada uno de sus personalizados. ¿Ya
          pensaste que querés estamparle a tu próxima prenda?
        </p>

        <div className="mb-6">
          <textarea
            className="  border w-1/2 border-gray-300 rounded-lg p-3 mb-4 "
            placeholder="Contanos tu idea..."
            value={ideas}
            onChange={(e) => setIdeas(e.target.value)}
          ></textarea>
          <div className="flex items-center  space-x-4">
            <span className="text-sm text-gray-800 ">Colores disponibles:</span>
          </div>
          <div className="flex mt-2 space-x-2">
            {" "}
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 hover:scale-105">
              {" "}
            </div>
            <div className="w-8 h-8  rounded-full bg-gray-400 hover:scale-105"></div>
            <div className="w-8 h-8  rounded-full bg-black hover:scale-105"></div>
          </div>
          <p className="mt-2 text-sm text-gray-800">Consulta por más colores</p>
        </div>

        <button
          className="bg-creativity-purple text-black font-medium py-3 px-6 hover:bg-custom-purple transitionn"
          onClick={handleAddToCart}
        >
          AÑADIR AL CARRITO
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
