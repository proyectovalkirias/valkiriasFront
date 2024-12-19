import { getProductById } from "@/api/productAPI";
import AddToCart from "@/components/AddToCart";
import { Product } from "@/interfaces/Product";
import React from "react";

interface ProductDetailProps {
  params: {
    id: string;
  };
}

const ProductDetail: React.FC<ProductDetailProps> = async ({ params }) => {
  let product: Product | null = null;

  try {
    product = await getProductById(params.id);
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl font-bold">
          Los productos no estan disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-[#7b548b] min-h-screen  ">
      <div className="p-4 rounded-lg shadow-md flex flex-col items-center w-1/2">
        <img
          src={product?.photos[0]}
          alt={product?.name || "Product Image"}
          className="mb-4 rounded-xl shadow-md hover:scale-105 ease-in-out duration-300"
        />
        <h1 className="mb-4 text-2xl font-bold">{product?.name}</h1>
        <p className="font-bold mb-4">Price: ${product?.price}</p>
        <p className="mb-4 text-gray-700">{product?.description}</p>

        <AddToCart product={product} />
      </div>
    </div>
  );
};

export default ProductDetail;
