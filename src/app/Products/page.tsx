"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import CategorySection from "@/components/CategorySection";
import { Product } from "@/interfaces/Product";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);

        const storedCategory = localStorage.getItem("selectedCategory");
        setSelectedCategory(storedCategory);

        if (storedCategory) {
          setFilteredProducts(
            data.filter((product) => product.category === storedCategory)
          );
        } else {
          setFilteredProducts(data);
        }
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
        <CategorySection
          title={selectedCategory || "Todos los productos"}
          products={filteredProducts}
        />
      </div>
    </div>
  );
};

export default Products;
