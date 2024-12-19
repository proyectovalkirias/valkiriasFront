"use client";

import React, { useEffect, useState } from "react";
import { getProducts, getProductsByCategory } from "@/api/productAPI";
import { Product } from "@/interfaces/Product";
import ProductCard from "./ProductCard";
import { usePathname } from "next/navigation";

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const pathname = usePathname();

  // Obtener categoría seleccionada desde localStorage al cargar
  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    setSelectedCategory(storedCategory);
  }, [pathname]);

  // Obtener productos desde la API cuando cambia la categoría
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const products = selectedCategory
          ? await getProductsByCategory(selectedCategory)
          : await getProducts();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("No se pudieron cargar los productos. Inténtalo nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

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

  // Mostrar productos o mensaje si no hay resultados
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center mb-4">
      {products.length > 0 ? (
        products.map((product: Product) => (
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
        ))
      ) : (
        <p className="text-gray-500 text-xl">No se encontraron productos.</p>
      )}
    </div>
  );
};

export default ProductList;
