"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/api/productAPI";
import { useRouter } from "next/navigation";

import { Product } from "@/interfaces/Product";

const ProductDetail: React.FC = () => {
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para personalización
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedSmallPrint, setSelectedSmallPrint] = useState<string>("");
  const [selectedLargePrint, setSelectedLargePrint] = useState<string>("");
  const [remainingStock, setRemainingStock] = useState<number>(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  useEffect(() => {
    if (!productId) {
      setError("El ID del producto no es válido.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProductById(productId);

        setProduct({
          ...fetchedProduct,
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
      alert(
        `Solo puedes agregar hasta ${remainingStock} unidades de este producto.`
      );
      return;
    }
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor, selecciona un tamaño antes de añadir al carrito.");
      return;
    }
    if (!selectedSmallPrint || !selectedLargePrint) {
      alert("Por favor, selecciona un estampado pequeño y uno grande.");
      return;
    }
    if (quantity > remainingStock) {
      alert(
        `No puedes agregar más de ${remainingStock} unidades de este producto.`
      );
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

    router.push("/Cart");
    alert("Producto añadido al carrito.");
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
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Producto no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center py-8 px-4">
      <div className="p-4 rounded-lg shadow-md flex flex-col items-center w-full max-w-3xl bg-white mb-8">
        <div className="relative w-full">
          <button
            onClick={handlePreviousPhoto}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
          >
            ◀
          </button>
          <img
            src={mainImage || undefined}
            alt={product.name}
            className="w-full h-64 object-cover rounded-xl shadow-md !important"
          />
          <button
            onClick={handleNextPhoto}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
          >
            ▶
          </button>
        </div>
        <h1 className="mb-4 text-2xl font-bold">{product.name}</h1>
        <p className="font-bold mb-4">
          Precio: $
          {Array.isArray(product.prices) && product.prices.length > 0
            ? product.prices[0]
            : "N/A"}
        </p>
        <p className="mb-4 text-gray-700">{product.description}</p>
      </div>

      <div className="w-full max-w-3xl p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Personaliza tu {product.category}
        </h2>

        <div className="mb-4">
          <label className="text-gray-800">Color:</label>
          <div className="flex flex-wrap gap-2">
            {(product.color || []).map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full border ${
                  selectedColor === color ? "ring-2 ring-purple-500" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setSelectedColor(color);
                  console.log(`Color seleccionado: ${color}`);
                }}
                title={color}
              ></button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-gray-800 flex items-center gap-2">
            Estampado pequeño:
            <div className="relative">
              <span className="text-xs font-bold bg-gray-200 rounded-full px-2 py-1 cursor-pointer">
                I
              </span>
              <div className="absolute left-0 top-full mt-1 w-64 bg-black text-white text-xs p-2 rounded opacity-0 hover:opacity-100 transition">
                Cada prenda incluye un estampado grande y uno pequeño.
              </div>
            </div>
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {(product.smallPrint || []).map((smallPrint, index) => (
              <button
                key={`small-${index}`}
                className={`p-2 border rounded ${
                  selectedSmallPrint === smallPrint
                    ? "ring-2 ring-purple-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedSmallPrint(smallPrint)}
              >
                <img
                  src={smallPrint}
                  alt={`Estampa pequeña ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-gray-800 flex items-center gap-2">
            Estampado grande:
            <div className="relative">
              <span className="text-xs font-bold bg-gray-200 rounded-full px-2 py-1 cursor-pointer">
                I
              </span>
              <div className="absolute left-0 top-full mt-1 w-64 bg-black text-white text-xs p-2 rounded opacity-0 hover:opacity-100 transition">
                Cada prenda incluye un estampado grande y uno pequeño.
              </div>
            </div>
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {(product.largePrint || []).map((largePrint, index) => (
              <button
                key={`large-${index}`}
                className={`p-2 border rounded ${
                  selectedLargePrint === largePrint
                    ? "ring-2 ring-purple-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedLargePrint(largePrint)}
              >
                <img
                  src={largePrint}
                  alt={`Estampa grande ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-gray-800">Tamaño:</label>
          <select
            className="text-gray-800 text-sm p-2 rounded w-full mt-2"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Selecciona un tamaño</option>
            {(product.sizes || []).map((sizes) => (
              <option key={sizes} value={sizes}>
                {sizes}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-gray-800">Cantidad:</label>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 bg-gray-200 text-gray-800 rounded"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity === 1}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              className="w-12 text-center border rounded"
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
            <button
              className="px-2 py-1 bg-gray-200 text-gray-800 rounded"
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

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-gray-800 font-bold">
              Precio Total: ${totalPrice.toFixed(2)}
            </p>
          </div>
          <button
            className="bg-purple-600 text-white font-medium py-3 px-6 rounded hover:bg-purple-700 transition"
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