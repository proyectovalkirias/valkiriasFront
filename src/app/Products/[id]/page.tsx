"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/api/productAPI";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Product } from "@/interfaces/Product";

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

  const sizeOrder = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "4",
    "6",
    "8",
    "10",
    "12",
    "14",
    "16",
  ];

  useEffect(() => {
    if (!productId) {
      setError("El ID del producto no es válido.");
      setLoading(false);
      return;
    }

    const user = localStorage.getItem("user");

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProductById(productId);

        const processedColors =
          fetchedProduct.color?.map((color) => color.replace(/\[|\]|"/g, "")) ||
          [];

        setProduct({
          ...fetchedProduct,
          color: processedColors,
        });

        setMainImage(
          Array.isArray(fetchedProduct.photos) &&
            fetchedProduct.photos.length > 0
            ? fetchedProduct.photos[0]
            : "/placeholder.png"
        );
        setRemainingStock(fetchedProduct.stock || 0);
      } catch (err) {
        setError("No se pudo cargar el producto. Intenta nuevamente.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);
  const getMaxPrice = (prices: number[]): number => {
    return Math.max(...prices.map(Number));
  };

  useEffect(() => {
    if (selectedSize && product) {
      const childSizes = ["2", "4", "6", "8", "10", "12", "14", "16"];
      const adultSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
      const [childPrice, adultPrice] = product.prices.map(Number);

      if (childSizes.includes(selectedSize)) {
        setTotalPrice(childPrice * quantity);
      } else if (adultSizes.includes(selectedSize)) {
        setTotalPrice(adultPrice * quantity);
      }
    }
  }, [selectedSize, quantity, product]);

  const handleQuantityChange = (value: number) => {
    if (value > remainingStock) {
      Swal.fire({
        icon: "warning",
        title: "Por favor, selecciona una cantidad válida.",
        confirmButtonColor: "#9333ea",
        timer: 2000,
      });
      return;
    }
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      Swal.fire({
        icon: "warning",
        title: "Por favor, selecciona una talla antes de agregar al carrito.",
        confirmButtonColor: "#9333ea",
        timer: 2000,
      });
      return;
    }
    if (!selectedSmallPrint || !selectedLargePrint) {
      Swal.fire({
        icon: "warning",
        title: "Por favor, selecciona un diseño antes de agregar al carrito.",
        confirmButtonColor: "#9333ea",
        timer: 2000,
      });
      return;
    }
    if (quantity > remainingStock) {
      Swal.fire({
        icon: "warning",
        title: "Por favor, selecciona una cantidad válida.",
        confirmButtonColor: "#9333ea",
        timer: 2000,
      });
      return;
    }
    if (selectedColor === "") {
      Swal.fire({
        icon: "warning",
        title: "Por favor, selecciona un color antes de agregar al carrito.",
        confirmButtonColor: "#1d4ed8",
        timer: 3000,
      });
      return;
    }

    const personalizedProduct = {
      product,
      selectedColor,
      selectedSize,
      selectedSmallPrint,
      selectedLargePrint,
      quantity,
      totalPrice,
    };

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(personalizedProduct);
    localStorage.setItem("cart", JSON.stringify(cart));

    setRemainingStock((prev) => prev - quantity);

    console.log("Producto agregado al carrito:", personalizedProduct);
    Swal.fire({
      icon: "success",
      title: "Producto agregado al carrito",
      confirmButtonColor: "#1d4ed8",
      timer: 3000,
    });

    router.push("/Cart");
  };

  const handleNextPhoto = () => {
    if (Array.isArray(product?.photos) && product.photos.length > 0) {
      setCurrentPhotoIndex(
        (prevIndex) => (prevIndex + 1) % product.photos.length
      );
      setMainImage(
        product.photos[(currentPhotoIndex + 1) % product.photos.length]
      );
    }
  };

  const handlePreviousPhoto = () => {
    if (Array.isArray(product?.photos) && product.photos.length > 0) {
      setCurrentPhotoIndex(
        (prevIndex) =>
          (prevIndex - 1 + product.photos.length) % product.photos.length
      );
      setMainImage(
        product.photos[
          (currentPhotoIndex - 1 + product.photos.length) %
            product.photos.length
        ]
      );
    }
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
      <div className="p-4 rounded-lg shadow-lg flex flex-col items-center w-full max-w-4xl  mb-8">
        <div className="relative w-full ">
          <button
            onClick={handlePreviousPhoto}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-purple-300 text-purple-900 p-2 rounded-full hover:bg-purple-400"
          >
            ◀
          </button>
          <img
            src={mainImage || undefined}
            alt={product.name}
            className="w-[500px] aspect-square mx-auto rounded-xl shadow-md "
          />
          <button
            onClick={handleNextPhoto}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-purple-300 text-purple-900 p-2 rounded-full hover:bg-purple-400"
          >
            ▶
          </button>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-800 text-center">
          {product.name}
        </h1>
        <p className="text-lg text-gray-600 text-center mt-2">
          {product.description}
        </p>
        <p className="text-xl font-bold text-gray-800 mt-4">
          Precio: $
          {Array.isArray(product.prices) && product.prices.length > 0
            ? getMaxPrice(product.prices)
            : "N/A"}
        </p>
      </div>

      <div className="w-full max-w-4xl p-6  rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Personaliza a medida
        </h2>
        {/* Sección de Colores */}
        <div className="mb-6">
          <label className="text-gray-800 font-semibold">Color:</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {(product.color || []).map((color) => (
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

        <div className="mb-6">
          <label className="text-gray-800 font-semibold relative group cursor-pointer">
            Estampado pequeño:
            <span className="absolute left-0 top-full mt-1 hidden group-hover:block bg-black text-white text-xs p-2 rounded-lg w-64">
              Incluye una estampa grande y una pequeña
            </span>
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {(product.smallPrint || []).map((smallPrint, index) => (
              <button
                key={`small-${index}`}
                className={`p-2 border rounded-lg ${
                  selectedSmallPrint === smallPrint
                    ? "ring-2 ring-purple-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedSmallPrint(smallPrint)}
              >
                <img
                  src={smallPrint}
                  alt={`Estampa pequeña ${index}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-800 font-semibold relative group cursor-pointer">
            Estampado grande:
            <span className="absolute left-0 top-full mt-1 hidden group-hover:block bg-black text-white text-xs p-2 rounded-lg w-64">
              Incluye una estampa grande y una pequeña
            </span>
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {(product.largePrint || []).map((largePrint, index) => (
              <button
                key={`large-${index}`}
                className={`p-2 border rounded-lg ${
                  selectedLargePrint === largePrint
                    ? "ring-2 ring-purple-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedLargePrint(largePrint)}
              >
                <img
                  src={largePrint}
                  alt={`Estampa grande ${index}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-800 font-semibold">Tamaño:</label>
          <select
            className="w-full p-3 border rounded-lg mt-2 text-gray-800"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Selecciona un tamaño</option>
            {sizeOrder
              .filter((size) => product.size?.includes(size)) // Filtra solo los tamaños disponibles
              .map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
          </select>
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
                handleQuantityChange(Math.max(1, parseInt(e.target.value) || 1))
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
            className="px-6 py-3 bg-purple-400 text-white font-medium rounded-lg hover:bg-purple-500"
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
