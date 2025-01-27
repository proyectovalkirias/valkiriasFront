"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/interfaces/Product";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

const colorNameMap: Record<string, string> = {
  "#000000": "Negro",
  "#f5f5ef": "Blanco",
  "#a6a6a6": "Gris",
  "#d80032": "Rojo",
  "#05299e": "Azul",
  "#f7e90f": "Amarillo",
  "#00913f": "Verde Benetton",
};

const API_URL = `https://valkiriasback.onrender.com`;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isCustomizable, setIsCustomizable] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/products`, {
          headers: { "Cache-Control": "no-cache" },
        });

        if (res.status !== 200) {
          throw new Error(`Failed to fetch products: ${res.statusText}`);
        }

        const allProducts = res.data as Product[];
        setProducts(allProducts);
        setFilteredProducts(allProducts);

        // Extraer categorías, colores y talles únicos
        const uniqueCategories = Array.from(
          new Set(allProducts.map((p) => p.category).filter(Boolean))
        );
        const uniqueColors = Array.from(
          new Set(
            allProducts
              .flatMap((p) => p.color || [])
              .filter(Boolean)
              .map((color) => color.replace(/"|\[|\]/g, ""))
          )
        );
        const uniqueSizes = Array.from(
          new Set(
            allProducts
              .flatMap((p) => p.sizes || [])
              .filter(Boolean)
              .map((size) => size.replace(/"|\[|\]/g, ""))
          )
        );

        setCategories(uniqueCategories);
        setColors(uniqueColors);
        setSizes(uniqueSizes);
      } catch (err) {
        setError("Error al cargar los productos. Intenta nuevamente. " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const updateFilteredProducts = () => {
      const filtered = products.filter((product) => {
        const matchesCategory =
          !selectedCategory ||
          product.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesColor =
          !selectedColor ||
          product.color?.some(
            (c) =>
              colorNameMap[c.replace(/"|\[|\]/g, "")]?.toLowerCase() ===
              selectedColor.toLowerCase()
          );
        const matchesSize =
          !selectedSize ||
          product.sizes?.some(
            (s) =>
              s.replace(/"|\[|\]/g, "").toLowerCase() ===
              selectedSize.toLowerCase()
          );
        const matchesCustomizable =
          isCustomizable === null || product.isCustomizable === isCustomizable;

        return (
          matchesCategory && matchesColor && matchesSize && matchesCustomizable
        );
      });

      setFilteredProducts(filtered);
    };

    updateFilteredProducts();
  }, [selectedCategory, selectedColor, selectedSize, isCustomizable, products]);

  // Agrupar productos por categoría
  const groupedProducts = filteredProducts.reduce(
    (acc: Record<string, Product[]>, product) => {
      const category = product.category || "Sin categoría";

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    },
    {}
  );

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center bg-purple-100 items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-purple-100 min-h-screen p-8">
      {/* Formulario de Filtros */}
      <div className="mb-8  p-4 rounded-lg">
        <h2 className="text-2xl text-gray-800 font-bold mb-4 text-center">
          Explora nuestra colección y encuentra el producto perfecto para ti.
        </h2>
        <div className="flex flex-wrap text-gray-800s gap-4 justify-center">
          {/* Filtro por Categoría */}
          <select
            className="p-2 border rounded text-purple-dark"
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Filtro por Color */}
          <select
            className="p-2 border rounded text-purple-dark"
            value={selectedColor || ""}
            onChange={(e) => setSelectedColor(e.target.value || null)}
          >
            <option value="">Todos los colores</option>
            {colors.map((color) => (
              <option key={color} value={colorNameMap[color] || color}>
                {colorNameMap[color] || color}
              </option>
            ))}
          </select>

          {/* Filtro por Talle */}
          <select
            className="p-2 border rounded text-purple-dark"
            value={selectedSize || ""}
            onChange={(e) => setSelectedSize(e.target.value || null)}
          >
            <option value="">Todos los talles</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* Filtro por Personalización */}
          <label className="flex items-center gap-2 text-purple-dark">
            <input
              type="checkbox"
              checked={isCustomizable === true}
              onChange={(e) =>
                setIsCustomizable(e.target.checked ? true : null)
              }
            />
            Personalizable
          </label>
        </div>
      </div>

      {/* Productos Agrupados */}
      <div className="mb-4">
        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center ">
                {category}
              </h2>
              <div className="flex flex-wrap gap-4 justify-center items-center">
                {groupedProducts[category].map((product) => (
                  <Link key={product.id} href={`/Products/${product.id}`}>
                    <div className="w-64 h-96 rounded-xl overflow-hidden p-4 bg-gray-100 hover:scale-105 transform transition duration-300 shadow-xl hover:shadow-2xl border border-gray-200">
                      {/* Imagen */}
                      <Image
                        className="rounded-lg object-cover w-48 h-48 mb-4 mx-auto"
                        src={
                          Array.isArray(product.photos) && product.photos[0]
                            ? product.photos[0]
                            : "/placeholder.png"
                        }
                        width={192}
                        height={192}
                        alt={product.name}
                      />

                      {/* Nombre del Producto */}
                      <h2 className="text-lg font-bold mb-2 text-center text-gray-800 line-clamp-2 hover:text-purple-800 transition">
                        {product.name}
                      </h2>

                      {/* Descripción */}
                      <p className="text-gray-600 text-center text-sm line-clamp-2">
                        {product.description}
                      </p>

                      {/* Información Adicional */}
                      <div className="flex justify-between items-center mt-6 gap-4">
                        {/* Precio */}
                        <p className="text-xl font-bold text-gray-800">
                          Precio: $
                          {Array.isArray(product.prices) &&
                          product.prices.length > 0
                            ? Math.min(
                                ...product.prices.map(
                                  (priceObj) => priceObj.price
                                )
                              )
                            : "N/A"}
                        </p>
                        {/* Stock */}
                        <p
                          className={`text-sm font-medium ${
                            product.stock > 0 ? "text-gray-600" : "text-red-600"
                          }`}
                        >
                          Stock: {product.stock > 0 ? product.stock : "Agotado"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center min-h-screen">
            <p className="text-2xl font-bold mb-4 text-gray-800">
              No hay productos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
