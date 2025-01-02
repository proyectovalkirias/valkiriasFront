"use client";

import React, { useEffect, useState } from "react";
import { getProducts } from "@/api/productAPI";
import { Product } from "@/interfaces/Product";
import Link from "next/link";
import { useSearchParams } from "next/navigation";


const colorNameMap: Record<string, string> = {
  "#ff0000": "Rojo",
  "#00ff00": "Verde",
  "#0000ff": "Azul",
  "#ffffff": "Blanco",
  "#000000": "Negro",
  "#ffff00": "Amarillo",
  "#ff00ff": "Fucsia",
  "#00ffff": "Cian",
  "#a6a6a6": "Gris",
  "#f5f5ef": "Marfil",
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros
  const [categories, setCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  // Orden de referencia para talles
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

  // Obtener todos los productos y opciones de filtrado
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts();
        setProducts(allProducts);

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
        ).sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));

        setCategories(uniqueCategories);
        setColors(uniqueColors);
        setSizes(uniqueSizes);
      } catch (err: any) {
        setError("Error al cargar los productos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Establecer el filtro de categoría si viene de la URL
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  // Filtrar productos según los filtros seleccionados
  const filteredProducts = products.filter((product) => {
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
          s.replace(/"|\[|\]/g, "").toLowerCase() === selectedSize.toLowerCase()
      );

    return matchesCategory && matchesColor && matchesSize;
  });

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

  return (
    <div className="bg-[#7b548b] min-h-screen p-8">
      {/* Formulario de Filtros */}
      <div className="mb-8  p-4 rounded-lg">
        <h2
          className="text-lg font-bold mb-4 text-center 
        "
        >
          Explora nuestra colección y encuentra el producto perfecto para ti.
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Filtro por Categoría */}
          <select
            className="p-2 border rounded"
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
            className="p-2 border rounded"
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
            className="p-2 border rounded"
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
        </div>
      </div>

      {/* Productos Agrupados */}
      <div className="mb-4">
        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center text-white">
                {category}
              </h2>
              <div className="flex flex-wrap gap-4 justify-center items-center  ">
                {groupedProducts[category].map((product) => (
                  <Link key={product.id} href={`/Products/${product.id}`}>
                    <div className="w-64 h-96  rounded overflow-hidden p-4 bg-white hover:scale-105 ease-in-out shadow-lg">
                      <img
                        className=" rounded-lg object-cover w-48 h-48 48mb-4 mx-auto"
                        src={product.photos?.[0] || "/placeholder.png"}
                        alt={product.name}
                      />
                      <h2 className="text-lg font-bold mb-2 text-center text-gray-800">
                        {product.name}
                      </h2>
                      <p className="text-gray-600 text-center">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-gray-600 font-bold">
                          $ {product.prices[0]}.00
                        </span>
                        <p className="text-gray-600">Stock: {product.stock}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-xl text-center">
            No se encontraron productos.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;