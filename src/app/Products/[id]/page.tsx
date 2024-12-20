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

  // Cargar el producto por ID
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
          id: String(fetchedProduct.id), // Convertir a cadena si es necesario
        });
        setSelectedColor(fetchedProduct.color[0] || "");
        setMainImage(fetchedProduct.photos[0] || "");
      } catch (err) {
        setError("No se pudo cargar el producto. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Calcular precio total
  useEffect(() => {
    if (product) {
      setTotalPrice(quantity * product.price);
    }
  }, [quantity, product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor, selecciona un tamaño antes de añadir al carrito.");
      return;
    }
  
    // Aquí preparas la información del producto con todos los detalles personalizados
    const personalizedProduct = {
      id: product?.id, // El ID del producto
      name: product?.name, // El nombre del producto
      price: product?.price, // El precio
      description: product?.description, // Descripción (si quieres agregarla)
      color: selectedColor, // El color seleccionado
      size: selectedSize, // El tamaño seleccionado
      quantity, // La cantidad seleccionada
      photos: product?.photos, // Las fotos del producto
      totalPrice, // El precio total, calculado con la cantidad
    };
  
    // Obtener el carrito actual del localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  
    // Agregar el nuevo producto al carrito
    cart.push(personalizedProduct);
  
    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  
    console.log("Producto agregado al carrito:", personalizedProduct);
  
    // Redirigir a la página de carrito
    router.push("/Cart");
  
    // Confirmación visual
    alert("Producto añadido al carrito.");
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

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center py-8 px-4">
      {/* Detalle del producto */}
      <div className="p-4 rounded-lg shadow-md flex flex-col items-center w-full max-w-3xl bg-white mb-8">
        <img
          src={mainImage}
          alt={product?.name}
          className="mb-4 rounded-xl shadow-md hover:scale-105 ease-in-out duration-300"
        />
        <h1 className="mb-4 text-2xl font-bold">{product?.name}</h1>
        <p className="font-bold mb-4">Precio: ${product?.price}</p>
        <p className="mb-4 text-gray-700">{product?.description}</p>
      </div>

      {/* Personalización */}
      <div className="w-full max-w-3xl p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Personaliza tu {product?.category}
        </h2>

        {/* Selección de colores */}
        <div className="mb-4">
          <label className="text-gray-800">Color:</label>
          <div className="flex flex-wrap gap-2">
            {product?.color.map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full border ${
                  selectedColor === color ? "ring-2 ring-purple-500" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              ></button>
            ))}
          </div>
        </div>

        {/* Opciones de estampado */}
        {Array.isArray((product as any)?.stamped) &&
        (product as any).stamped.length ? (
          <div className="mb-4">
            <label className="text-gray-800">Opciones de estampado:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {(product as any).stamped.map(
                (stamped: string, index: number) => (
                  <button
                    key={index}
                    className={`p-2 border rounded ${
                      mainImage === stamped
                        ? "ring-2 ring-purple-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(stamped)}
                  >
                    <img
                      src={stamped}
                      alt={`Estampa ${index}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">
            No hay opciones de estampado disponibles.
          </p>
        )}

        {/* Talla y cantidad */}
        <div className="mb-4">
          <label className="text-gray-800">Tamaño:</label>
          <select
            className="text-gray-800 text-sm p-2 rounded w-full mt-2"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Selecciona un tamaño</option>
            {product?.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-gray-800">Cantidad:</label>
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 bg-gray-200 text-gray-800 rounded"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <input
              type="number"
              className="w-12 text-center border rounded"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
            <button
              className="px-2 py-1 bg-gray-200 text-gray-800 rounded"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
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
