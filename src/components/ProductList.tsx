"use client";

import React, { useEffect, useState } from "react";
import { getProducts } from "@/api/productAPI";
import { Product } from "@/interfaces/Product";
import ProductCard from "./ProductCard";
import { usePathname } from "next/navigation";

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const pathname = usePathname();

  // Obtener productos y categoría seleccionada
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts(); // Suponiendo que `getProducts` obtiene todos los productos
        setProducts(allProducts);
      } catch (err: any) {
        setError("Error al cargar los productos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    const storedCategory = localStorage.getItem("selectedCategory");
    setSelectedCategory(storedCategory);
    fetchProducts();
  }, [pathname]);

  // Filtrar productos si hay una categoría seleccionada
  const filteredProducts =
    selectedCategory && selectedCategory !== "all"
      ? products.filter(
          (product) =>
            product.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      : products;

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

  // Mostrar indicador de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Cargando productos...</p>
      </div>
    );
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  // Mostrar productos agrupados o mensaje si no hay resultados
  return (
    <div className="mb-4 ">
      {Object.keys(groupedProducts).length > 0 ? (
        Object.keys(groupedProducts).map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">{category}</h2>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {groupedProducts[category].map((product: Product) => (
                <ProductCard
                  id={product.id}
                  key={product.id}
                  name={product.name}
                  photos={product.photos}
                  price={product.price}
                  description={product.description}
                  stock={product.stock}
                  sizes={product.sizes || []}
                  category={product.category || ""}
                  color={product.color || ""}
                />
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
  );
};

export default ProductList;
