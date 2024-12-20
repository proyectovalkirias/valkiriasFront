"use client";

import React, { useEffect, useState } from "react";
import { getProducts } from "@/api/productAPI";
import { Product } from "@/interfaces/Product";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Products: React.FC = () => {
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
        const allProducts = await getProducts();
        setProducts(allProducts);
      } catch (err: any) {
        setError("Error al cargar los productos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pathname]);

  // Filtrar productos si hay una categoría seleccionada
  const filteredProducts =
    selectedCategory && selectedCategory !== "all"
      ? products.filter(
          (product) =>
            product.category?.toLowerCase() === selectedCategory.toLowerCase()
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

  return (
    <div className="bg-[#7b548b] min-h-screen p-8">
      <p className="mt-4 text-lg font-semibold mb-4 text-center text-white">
        Explora nuestra colección y encuentra el producto perfecto para ti.
      </p>

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

//hacer el fetch a products y traer el listado de los productos 