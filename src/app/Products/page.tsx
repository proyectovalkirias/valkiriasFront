import { ProductList } from "@/components/ProductList";

const Products: React.FC = () => {
  return (
    <div>
      <p className=" mt-4 text-lg font-semibold mb-4  text-center">
        Explora nuestra colección y encuentra el producto perfecto para ti.
      </p>

      <ProductList />
    </div>
  );
};

export default Products;
