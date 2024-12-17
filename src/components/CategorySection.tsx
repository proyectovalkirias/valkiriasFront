import React from "react";
import { Product } from "@/interfaces/Product";

interface Props {
  title: string;
  products: Product[];
}

const CategorySection: React.FC<Props> = ({ title, products }) => {
  return (
    <div className="mb-8 tra">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.name}
            className="p-4 border rounded transform hover:scale-105  shadow bg-white"
          >
            <img
              src={product.photos[0]}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-500">${product.price}</p>
            <p className="text-sm text-gray-500">{product.color}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
