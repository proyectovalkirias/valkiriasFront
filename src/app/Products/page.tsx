"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import CategorySection from "@/components/CategorySection";
import { Product } from "@/interfaces/Product";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products"); // Cambia por tu endpoint real
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);

        // Extraer categorías únicas dinámicamente
        const uniqueCategories = Array.from(
          new Set(data.map((product) => product.category))
        );
        setCategories(uniqueCategories);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex h-screen bg-[#7b548b]">
      <div className="flex-1 p-8 overflow-auto">
        {categories.map((category, index) => {
          // Filtrar productos por categoría
          const filteredProducts = products.filter(
            (product) => product.category === category
          );

          return (
            <CategorySection
              key={index}
              title={category}
              products={filteredProducts}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Products;
