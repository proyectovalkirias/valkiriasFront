import React from "react";
import Sidebar from "../../components/Sidebar";
import CategorySection from "@/components/CategorySection";
const Products = () => {
  const categories = [
    { title: "Remeras", products: [1, 2, 3, 4] },
    { title: "Buzos con Capucha", products: [1, 2, 3, 4] },
    { title: "Buzos sin Capucha", products: [1, 2, 3, 4] },
    { title: "Accesorios", products: [1, 2, 3, 4] },
    { title: "Niños", products: [1, 2, 3, 4] },
    { title: "Combos", products: [1, 2, 3, 4] },
  ];

  return (
    <div className="flex h-screen ">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        {categories.map((category, index) => (
          <CategorySection
            key={index}
            title={category.title}
            products={category.products}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
