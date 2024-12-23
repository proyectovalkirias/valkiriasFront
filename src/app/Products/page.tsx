"use client";

import React, { useEffect, useState } from "react";
import { getProducts } from "@/api/productAPI";
import { Product } from "@/interfaces/Product";
import Link from "next/link";

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
          new Set(allProducts.flatMap((p) => p.color || []).filter(Boolean))
        );
        const uniqueSizes = Array.from(
          new Set(allProducts.flatMap((p) => p.sizes || []).filter(Boolean))
        );

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

  // Filtrar productos según los filtros seleccionados
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesColor =
      !selectedColor ||
      product.color?.some(
        (c) => c.toLowerCase() === selectedColor.toLowerCase()
      );
    const matchesSize =
      !selectedSize ||
      product.sizes?.some(
        (s) => s.toLowerCase() === selectedSize.toLowerCase()
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
      <p className="mt-4 text-lg font-semibold mb-4 text-center text-white">
        Explora nuestra colección y encuentra el producto perfecto para ti.
      </p>

      {/* Formulario de Filtros */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4 text-center text-gray-800">
          Filtrar Productos
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
              <option key={color} value={color}>
                {color}
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
              <div className="flex flex-wrap gap-4 justify-center items-center">
                {groupedProducts[category].map((product) => (
                  <Link key={product.id} href={`/Products/${product.id}`}>
                    <div className="max-w-xs rounded overflow-hidden p-4 bg-white hover:scale-105 ease-in-out shadow-lg">
                      <img
                        className="w-full h-auto rounded-lg object-cover"
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
                          $ {product.price}.00
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
