"use client";

import { useState, useEffect } from "react";

const ProductDetail: React.FC = () => {
  const [ideas, setIdeas] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isKidsSize, setIsKidsSize] = useState<boolean>(false);
  const [printOption, setPrintOption] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const basePrice = 10;

  // Calcular precio total cada vez que cambian las opciones
  useEffect(() => {
    let sizePrice = isKidsSize ? 2 : 5;
    let printPrice = 0;

    if (printOption === "Pequeño en frente") {
      printPrice = 3;
    } else if (printOption === "Grande atrás") {
      printPrice = 5;
    } else if (printOption === "Ambos") {
      printPrice = 7;
    }

    setTotalPrice(basePrice + sizePrice + printPrice);
  }, [isKidsSize, printOption, selectedSize]);

  const handleAddToCart = () => {
    console.log({
      ideas,
      selectedSize: isKidsSize
        ? `Niño: ${selectedSize}`
        : `Adulto: ${selectedSize}`,
      printOption,
      selectedColor,
      totalPrice,
      imageFileName: imageFile ? imageFile.name : "No image uploaded",
    });
    // Aquí puedes agregar la lógica para añadir al carrito
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div className="h-screen bg-purple-100 flex items-center py-8 px-4">
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

      <div className="w-1/2 max-w-4xl text-center p-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          Remera unisex para estampa
        </h1>
        <p className="text-lg text-gray-800 mb-6">
          Nosotros seguimos trabajando en cada uno de sus personalizados. ¿Ya
          pensaste que querés estamparle a tu próxima prenda?
        </p>

        {/* Selección de talles */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium text-lg mb-2">
            Selecciona un talle:
          </label>
          <div className="flex items-center gap-4 space-x-4 mb-2">
            <label className="flex items-center text-gray-800">
              <input
                type="checkbox"
                checked={isKidsSize}
                onChange={() => setIsKidsSize(!isKidsSize)}
                className="mr-2"
              />
              Talle para niños
            </label>
            <select
              className="border w-1/3 text-gray-800 border-gray-300 rounded-lg p-2"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Selecciona</option>
              {isKidsSize
                ? ["4", "6", "8", "10", "12", "14", "16"].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))
                : ["S", "M", "L", "XL", "XXL"].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* Opciones de estampado */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium text-lg mb-2">
            Opciones de estampado:
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center text-gray-800">
              <input
                type="radio"
                name="printOption"
                value="Pequeño en frente"
                checked={printOption === "Pequeño en frente"}
                onChange={(e) => setPrintOption(e.target.value)}
                className="mr-2"
              />
              Pequeño en frente
            </label>
            <label className="flex items-center text-gray-800">
              <input
                type="radio"
                name="printOption"
                value="Grande atrás"
                checked={printOption === "Grande atrás"}
                onChange={(e) => setPrintOption(e.target.value)}
                className="mr-2"
              />
              Grande atrás
            </label>
            <label className="flex items-center text-gray-800">
              <input
                type="radio"
                name="printOption"
                value="Ambos"
                checked={printOption === "Ambos"}
                onChange={(e) => setPrintOption(e.target.value)}
                className="mr-2"
              />
              Ambos
            </label>
          </div>
        </div>

        {/* Selección de colores */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium text-lg mb-2">
            Selecciona un color:
          </label>
          <div className="flex space-x-4">
            {["Blanco", "Gris", "Negro"].map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full border ${
                  selectedColor === color
                    ? "ring-2 ring-purple-500"
                    : "border-gray-300"
                }`}
                style={{
                  backgroundColor:
                    color === "Blanco"
                      ? "#ffffff"
                      : color === "Gris"
                      ? "#d3d3d3"
                      : "#000000",
                }}
                onClick={() => setSelectedColor(color)}
              ></button>
            ))}
          </div>
        </div>

        {/* Adjuntar archivo */}
        <div className="mb-6">
          <label className="text-gray-800 font-medium text-lg mb-2">
            Adjuntar imagen:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className=" w-1/2 border-gray-300 rounded-lg p-2"
          />
          {imageFile && (
            <p className="mt-2 text-sm text-gray-600">
              Archivo seleccionado: {imageFile.name}
            </p>
          )}
        </div>
        {/* Campo para ideas */}
        <textarea
          className="border w-1/2 border-gray-300 text-gray-800 rounded-lg p-3 h-12 mb-4"
          placeholder="Contanos tu idea..."
          value={ideas}
          onChange={(e) => setIdeas(e.target.value)}
        ></textarea>

        {/* Mostrar precio total */}
        <div className="mb-6">
          <p className="text-lg font-bold text-gray-800">
            Precio total: ${totalPrice}
          </p>
        </div>

        {/* Botón añadir al carrito */}
        <button
          className="bg-creativity-purple text-black font-medium py-3 px-6 hover:bg-custom-purple transition"
          onClick={handleAddToCart}
        >
          AÑADIR AL CARRITO
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
