"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/Product";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

// Componente reutilizable para seleccionar estampados
const PrintSelector = ({
  prints,
  selectedPrint,
  setSelectedPrint,
  label,
}: {
  prints: string[];
  selectedPrint: string;
  setSelectedPrint: (print: string) => void;
  label: string;
}) => (
  <div className="mb-6">
    <label className="text-gray-800 font-semibold relative group cursor-pointer">
      {label}:
      <span className="absolute left-0 top-full mt-1 hidden group-hover:block bg-black text-white text-xs p-2 rounded-lg w-64">
        Incluye una estampa grande y una pequeña
      </span>
    </label>
    <div className="flex flex-wrap gap-4 mt-2">
      {prints.map((print, index) => (
        <button
          key={index}
          className={`p-2 border rounded-lg ${
            selectedPrint === print
              ? "ring-2 ring-purple-500"
              : "border-gray-300"
          }`}
          onClick={() => setSelectedPrint(print)}
        >
          <Image
            src={print}
            alt={`${label} ${index}`}
            className="w-20 h-20 object-cover rounded-md"
            width={100}
            height={100}
          />
        </button>
      ))}
    </div>
  </div>
);

const ProductDetail: React.FC = () => {
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedSmallPrint, setSelectedSmallPrint] = useState<string>("");
  const [selectedLargePrint, setSelectedLargePrint] = useState<string>("");
  const [remainingStock, setRemainingStock] = useState<number>(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [clientIdeas, setClientIdeas] = useState<string>("");

  useEffect(() => {
    if (!productId) {
      setError("El ID del producto no es válido.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const getProductById = async (id: string): Promise<Product> => {
          const getToken = () => {
            const user = localStorage.getItem("user");

            if (!user) {
              console.error("No hay datos del usuario en localStorage");
              return null;
            }

            try {
              const parsedUser = JSON.parse(user);
              return parsedUser.token || null; // Retorna el token si existe
            } catch (err) {
              console.error("Error al parsear los datos del usuario:", err);
              return null;
            }
          };

          const token = getToken();
          if (!token) {
            console.error("No se encontró el token.");
          }
          const response = await axios(
            `https://valkiriasback.onrender.com/products/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status !== 200) {
            throw new Error(`Failed to fetch product: ${response.statusText}`);
          }

          return response.data as Product;
        };

        const fetchedProduct = await getProductById(productId);

        if (!fetchedProduct || typeof fetchedProduct !== "object") {
          throw new Error("Producto no válido.");
        }

        // Limpieza de tamaños si es un array de strings
        if (Array.isArray(fetchedProduct.sizes)) {
          fetchedProduct.sizes = fetchedProduct.sizes.map((size: string) =>
            size.replace(/\\|"/g, "")
          );
        }

        setProduct(fetchedProduct);
        setMainImage(
          Array.isArray(fetchedProduct.photos) &&
            fetchedProduct.photos.length > 0
            ? fetchedProduct.photos[0]
            : "/placeholder.png"
        );
        setRemainingStock(fetchedProduct.stock || 0);
      } catch (error) {
        setError("No se pudo cargar el producto. Intenta nuevamente.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);
  console.log(product);
  useEffect(() => {
    if (selectedSize && product?.prices) {
      const sizePrice = product.prices.find(
        (sizeObj) => sizeObj.size === selectedSize
      );

      if (sizePrice) {
        setTotalPrice(sizePrice.price * quantity);
      }
    }
  }, [selectedSize, quantity, product?.prices]);

  const handleQuantityChange = (value: number) => {
    if (value <= 0 || value > remainingStock) {
      toast.error("Por favor, selecciona una cantidad válida.");
      return;
    }
    setQuantity(value);
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error("Selecciona un tamaño");
    if (quantity > remainingStock) return toast.error("Stock insuficiente");

    const personalizedProduct = {
      product,
      selectedColor,
      selectedSize,
      selectedSmallPrint,
      selectedLargePrint,
      quantity,
      totalPrice,
      uploadedImage,
      clientIdeas,
    };

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(personalizedProduct);
    localStorage.setItem("cart", JSON.stringify(cart));

    setRemainingStock((prev) => prev - quantity);
    toast.success("Producto agregado al carrito");
    router.push("/Cart");
  };

  const handlePhotoChange = (direction: "next" | "prev") => {
    if (!product?.photos) return;

    const newIndex =
      direction === "next"
        ? (currentPhotoIndex + 1) % product.photos.length
        : (currentPhotoIndex - 1 + product.photos.length) %
          product.photos.length;

    setCurrentPhotoIndex(newIndex);
    setMainImage(product.photos[newIndex]);
  };

  if (loading) {
    return (
      <div className="flex justify-center bg-purple-100 items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-purple-100">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-purple-100">
        <p className="text-gray-500 text-xl">Producto no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center py-8 px-4">
      <div className="p-4 rounded-lg flex flex-col items-center w-full max-w-4xl mb-8">
        <div className="relative w-full">
          <button
            onClick={() => handlePhotoChange("prev")}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-purple-300 text-purple-900 p-2 rounded-full hover:bg-purple-400"
          >
            ◀
          </button>
          <Image
            src={mainImage}
            alt={product.name}
            className="mx-auto rounded-xl max-h-[500px] shadow-md"
            width={500}
            height={500}
          />

          <button
            onClick={() => handlePhotoChange("next")}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-purple-300 text-purple-900 p-2 rounded-full hover:bg-purple-400"
          >
            ▶
          </button>
        </div>

        <div>
          <h1 className="mt-4 text-3xl font-bold text-gray-800 text-center">
            {product.name}
          </h1>
          <p className="text-lg text-gray-600 text-center mt-2">
            {product.description}
          </p>
          <p className="text-xl font-bold text-center text-gray-800 mt-4">
            Precio: $
            {Array.isArray(product.prices) && product.prices.length > 0
              ? Math.min(...product.prices.map((priceObj) => priceObj.price))
              : "N/A"}
          </p>

          {!product.isCustomizable && (
            <>
              <div className="mt-4 flex space-x-4">
                <label className="block text-gray-800 mt-4 font-semibold">
                  Cantidad:
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  className="w-24 h-12 border border-gray-300 rounded-md text-gray-800 py-2 px-4 mt-2"
                />

                <label className="block text-gray-800 font-semibold mt-4">
                  Tamaño:
                </label>
                <select
                  className="h-12 p-3 border rounded-lg mt-2 text-gray-800"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">Selecciona un tamaño</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center">
                {" "}
                <p className="text-2xl font-bold text-gray-800">
                  Precio Total: ${totalPrice.toFixed(2)}
                </p>
                <button
                  className="bg-valkyrie-purple w-1/2 text-white p-2 rounded-lg hover:bg-creativity-purple mt-4"
                  onClick={handleAddToCart}
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Añadir al carrito"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {product.isCustomizable && (
        <div className="w-full max-w-4xl p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Personaliza a medida
          </h2>

          {product.color?.length > 0 && (
            <div className="mb-6">
              <label className="text-gray-800 font-semibold">Color:</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {product.color.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border ${
                      selectedColor === color
                        ? "ring-2 ring-purple-500"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  ></button>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(product.smallPrint) &&
            product.smallPrint.length > 0 && (
              <PrintSelector
                prints={product.smallPrint}
                selectedPrint={selectedSmallPrint}
                setSelectedPrint={setSelectedSmallPrint}
                label="Estampado pequeño"
              />
            )}
          {Array.isArray(product.largePrint) &&
            product.largePrint.length > 0 && (
              <PrintSelector
                prints={product.largePrint}
                selectedPrint={selectedLargePrint}
                setSelectedPrint={setSelectedLargePrint}
                label="Estampado grande"
              />
            )}

          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <label className="text-gray-800 font-semibold">Tamaño:</label>
              <select
                className="w-full p-3 border rounded-lg mt-2 text-gray-800"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Selecciona un tamaño</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-6">
            <label className="text-gray-800 font-semibold">Subir Imagen:</label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-gray-800 mt-2 p-2 rounded-lg "
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
          </div>

          <div className="mb-6">
            <label className="text-gray-800 font-semibold">
              Ideas del Cliente:
            </label>
            <textarea
              className="w-full p-3 border rounded-lg mt-2 text-gray-800"
              placeholder="Describe tus ideas o personalización deseada..."
              value={clientIdeas}
              onChange={(e) => setClientIdeas(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="text-gray-800 font-semibold">Cantidad:</label>
            <div className="flex items-center gap-4 mt-2">
              <button
                className="px-4 py-2 bg-purple-300 text-purple-900 rounded-lg hover:bg-purple-400"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity === 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                className="w-16 text-center border rounded-lg text-gray-800"
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                }
              />
              <button
                className="px-4 py-2 bg-purple-300 text-purple-900 rounded-lg hover:bg-purple-400"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= remainingStock}
              >
                +
              </button>
            </div>
            <p className="text-gray-800 mt-2">
              Stock disponible: {remainingStock}
            </p>
          </div>

          <div className="flex justify-between items-center mt-6">
            <p className="text-2xl font-bold text-gray-800">
              Precio Total: ${totalPrice.toFixed(2)}
            </p>

            <button
              className="bg-valkyrie-purple w-1/2  text-white p-2 rounded-lg hover:bg-creativity-purple"
              onClick={handleAddToCart}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Añadir al carrito"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
