"use client";

import { useState, useEffect } from "react";

const ProductDetailAccessories: React.FC = () => {
  const [ideas, setIdeas] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>(""); // Gorras, gorros, tazas
  const [printOption, setPrintOption] = useState<string>(""); // Ubicación del estampado
  const [selectedColor, setSelectedColor] = useState<string>(""); // Color seleccionado
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const basePrices: { [key: string]: number } = {
    Gorra: 15,
    Gorro: 12,
    Taza: 10,
  };

  // Calcular precio total cada vez que cambian las opciones
  useEffect(() => {
    const basePrice = basePrices[selectedProduct] || 0;
    let printPrice = 0;

    if (printOption === "Frontal") {
      printPrice = 3;
    } else if (printOption === "Lateral") {
      printPrice = 2;
    } else if (printOption === "Ambos") {
      printPrice = 5;
    }

    setTotalPrice(basePrice + printPrice);
  }, [selectedProduct, printOption]);

  const handleAddToCart = () => {
    console.log({
      ideas,
      selectedProduct,
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
    <div className="h-screen bg-blue-100 flex items-center py-8 px-4">
      <div className="flex mx-16 gap-4 h-[600px] w-1/2">
        <div className="flex flex-col gap-4 w-1/2">
          <img
            src="https://th.bing.com/th/id/OIP.oNAfTWDzPymSqg4iq5rLCgHaHa?rs=1&pid=ImgDetMain"
            alt="Gorra"
            className="object-cover rounded-lg w-full h-1/2"
          />
          <img
            src="https://via.placeholder.com/150"
            alt="Gorro"
            className="object-cover rounded-lg w-full h-1/2"
          />
        </div>

        <div className="flex flex-col gap-4 w-1/2">
          <img
            src="https://via.placeholder.com/150"
            alt="Gorra"
            className="object-cover rounded-lg w-full h-1/2"
          />
          <img
            src="https://via.placeholder.com/150"
            alt="Gorro"
            className="object-cover rounded-lg w-full h-1/2"
          />
        </div>
      </div>

      <div className="w-1/2 max-w-4xl text-center p-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          Personaliza gorra, gorro, taza o tote-bag
        </h1>
        <p className="text-lg text-gray-800 mb-6">
          Elige el producto que deseas personalizar y hazlo único con tu diseño.
        </p>

        {/* Selección de producto */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium text-lg mb-2">
            Selecciona un producto:
          </label>
          <select
            className="border w-1/2 text-gray-800 border-gray-300 rounded-lg p-2"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Selecciona</option>
            <option value="Gorra">Gorra</option>
            <option value="Gorro">Gorro</option>
            <option value="Taza">Taza</option>
            <option value="Tote">Tote-bag</option>
          </select>
        </div>

        {/* Selección de colores */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium text-lg mb-2">
            Selecciona un color:
          </label>
          <div className="flex space-x-4">
            {["Blanco", "Gris", "Negro", "Rojo", "Azul"].map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full border ${
                  selectedColor === color
                    ? "ring-2 ring-blue-500"
                    : "border-gray-300"
                }`}
                style={{
                  backgroundColor:
                    color === "Blanco"
                      ? "#ffffff"
                      : color === "Gris"
                      ? "#d3d3d3"
                      : color === "Negro"
                      ? "#000000"
                      : color === "Rojo"
                      ? "#ff0000"
                      : "#0000ff",
                }}
                onClick={() => setSelectedColor(color)}
              ></button>
            ))}
          </div>
        </div>

        {/* Adjuntar archivo */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium text-lg mb-2">
            Adjuntar imagen:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border w-1/2 border-gray-300 rounded-lg p-2"
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
          className="bg-blue-500 text-white font-medium py-3 px-6 hover:bg-blue-700 transition"
          onClick={handleAddToCart}
        >
          AÑADIR AL CARRITO
        </button>
      </div>
    </div>
  );
};

export default ProductDetailAccessories;
