"use client";

import { useState, useEffect } from "react";

const CreateAccesorio: React.FC = () => {
  const [ideas, setIdeas] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isKidsSize, setIsKidsSize] = useState<boolean>(false);
  const [printOptions, setPrintOptions] = useState<string[]>([]); // Array para múltiples selecciones
  const [selectedColor, setSelectedColor] = useState<string>("Gris");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>(
    "/images/TU_IMAGEN_AQUI_20241210_210417_0000-removebg-preview.png"
  );
  const basePrice = 20;

  // Asociación de colores con imágenes
  const colorImages: Record<string, string> = {
    Gris: "/images/TU_IMAGEN_AQUI_20241210_210417_0000-removebg-preview.png",
    Negro: "/images/TU_IMAGEN_AQUI_20241210_211040_0000-removebg-preview.png",
  };

  const printImages: Record<string, Record<string, string>> = {
    Gris: {
      "Grande en frente":
        "/images/TU_IMAGEN_AQUI_20241210_210417_0000-removebg-preview.png",
      "Grande atrás":
        "/images/TU_IMAGEN_AQUI_20241210_205800_0000-removebg-preview.png",
      "Pequeño en frente lado derecho":
        "/images/TU_IMAGEN_AQUI_20241210_210522_0000-removebg-preview.png",
      "Pequeño en frente centro":
        "/images/TU_IMAGEN_AQUI_20241210_210500_0000-removebg-preview.png",
      "Pequeño atrás":
        "/images/TU_IMAGEN_AQUI_20241210_210726_0000-removebg-preview.png",
    },
    Negro: {
      "Grande en frente":
        "/images/TU_IMAGEN_AQUI_20241210_211040_0000-removebg-preview.png",
      "Grande atrás":
        "/images/TU_IMAGEN_AQUI_20241210_205617_0000-removebg-preview.png",
      "Pequeño en frente lado derecho":
        "/images/TU_IMAGEN_AQUI_20241210_211001_0000-removebg-preview.png",
      "Pequeño en frente centro":
        "/images/TU_IMAGEN_AQUI_20241210_210944_0000-removebg-preview.png",
      "Pequeño atrás":
        "/images/TU_IMAGEN_AQUI_20241210_210909_0000-removebg-preview.png",
    },
  };

  // Actualiza la imagen principal al cambiar color
  useEffect(() => {
    setMainImage(colorImages[selectedColor]);
  }, [selectedColor]);

  // Calcular precio total
  useEffect(() => {
    let sizePrice = isKidsSize ? 2 : 5;
    let printPrice = printOptions.length * 3; // Cada estampado suma 3 al precio

    setTotalPrice(quantity * (basePrice + sizePrice + printPrice));
  }, [isKidsSize, printOptions, selectedSize, quantity]);

  const handleAddToCart = () => {
    // Detalles del producto a agregar
    const productDetails = {
      ideas,
      size: isKidsSize ? `Niño: ${selectedSize}` : `Adulto: ${selectedSize}`,
      printOptions,
      color: selectedColor,
      price: totalPrice,
      imageFileName: imageFile ? imageFile.name : "No image uploaded",
    };

    // Obtener el carrito existente del localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as any[];

    // Agregar el nuevo producto al carrito
    cart.push(productDetails);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Mostrar alerta al usuario
    alert("Producto agregado al carrito");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleTogglePrintOption = (option: string) => {
    setPrintOptions(
      (prevOptions) =>
        prevOptions.includes(option)
          ? prevOptions.filter((opt) => opt !== option) // Quita la opción si ya está seleccionada
          : [...prevOptions, option] // Agrega la opción si no está seleccionada
    );
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center py-8 px-4">
      <div className="h-[90%] w-1/2">
        <div className="flex gap-3 h-2/3">
          {/* Imagen principal que cambia según color y estampa */}
          <div className="flex justify-center w-3/4">
            <img
              src={mainImage}
              alt="Imagen principal"
              className=" max-h-96 w-64 rounded-lg "
            />
          </div>

          {/* Columnas de imágenes pequeñas */}
          <div className="flex flex-col gap-3 h-full w-1/4 text-center justify-center">
            {Object.values(printImages[selectedColor]).map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`Miniatura ${index}`}
                className={`w-12 h-12 object-cover rounded-lg cursor-pointer ${
                  mainImage === imgSrc ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => setMainImage(imgSrc)}
              />
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="h-1/3 p-2 gap-2 mt-2 flex flex-col">
          {/* Selección de colores */}
          <div className="flex gap-4 text-center justify-start align-center">
            <label className="text-gray-800 mt-1 text-sm mt-2">
              Selecciona un color:
            </label>
            <div className="flex space-x-4">
              {Object.keys(colorImages).map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full border ${
                    selectedColor === color ? "ring-2" : ""
                  }`}
                  style={{
                    backgroundColor: color === "Gris" ? "#d3d3d3" : "#000000",
                  }}
                  onClick={() => setSelectedColor(color)}
                ></button>
              ))}
            </div>
          </div>

          {/* Cantidad */}
          <div className="flex items-center mt-4">
            <label className="text-gray-800 text-sm mr-4">Cantidad:</label>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1 bg-gray-200 text-gray-800 rounded-l"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="text-center w-12"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-2 py-1 bg-gray-200 text-gray-800 rounded-r"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Sección derecha */}
      <div className="w-1/2 max-w-4xl h-[90%] p-6">
        <div className="h-2/3 flex flex-col justify-center">
          <h1 className="text-3xl lg:text-3xl font-bold text-gray-800 mb-4">
            Accesorios
          </h1>

          <div className="mb-6">
            <p className="text-lg font-bold text-gray-800">
              Precio total: ${totalPrice}
            </p>
          </div>

          <p className="text-lg text-gray-800 mb-6">
            Te ofrecemos la oportunidad de personalizar tu prenda con tu propia
            imagen. Nuestro equipo de expertos estampadores se encargan de
            transformar tu idea en una prenda única y personalizada.
          </p>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-800 w-full font-medium text-lg mb-2">
            Tu idea:
          </label>
          <textarea
            className="border flex w-full border-gray-300 text-gray-800 rounded-lg p-3 h-12 mb-4"
            placeholder="Contanos tu idea..."
            value={ideas}
            onChange={(e) => setIdeas(e.target.value)}
          ></textarea>

          <div className="mb-4 w-full">
            <label className="text-gray-800 w-full font-medium text-lg mb-2">
              Adjuntar imagen:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            {imageFile && (
              <p className="mt-2 text-sm text-gray-600">
                Archivo seleccionado: {imageFile.name}
              </p>
            )}
          </div>

          <button
            className="bg-purple-600 text-white font-medium py-3 px-6 rounded hover:bg-purple-700 transition w-1/2 self-center"
            onClick={handleAddToCart}
          >
            AÑADIR AL CARRITO
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccesorio;
