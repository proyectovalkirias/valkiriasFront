/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Product } from "@/interfaces/Product";

const ProductCard: React.FC<Product> = ({
  id,
  name,
  price,
  photos,
  stock,
  description,
  sizes,
  category,
  color,
}) => {
  return (
    <Link href={`/Product/${id}`}>
      <div
        className="   max-w-xs  rounded   overflow-hidden p-4 bg-white/95 hover:scale-105  hover:bg-white  ease-in-out"
        key={name}
      >
        <img
          className=" w-full h-auto  mix-blend-multiply   rounded-lg "
          src={photos[0]}
          alt={name}
        />
        <h2 className=" text-lg font-bold mb-2  text-center text-gray-800   ">
          {name}
        </h2>

        <p className="  text-gray-600 dark:text-gray-800  text-center ">
          {description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-600 font-bold dark:text-gray-400  text-center ">
            {" "}
            $ {price}.00
          </span>
          <p className="text-gray-600 dark:text-gray-400  text-center ">
            Stock: {stock}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
