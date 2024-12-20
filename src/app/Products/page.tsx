import { ProductList } from "@/components/ProductList";

const Products: React.FC = () => {
  return (
    <div className="bg-[#7b548b] min-h-screen p-8">
      <p className=" mt-4 text-lg font-semibold mb-4  text-center">
        Explora nuestra colección y encuentra el producto perfecto para ti.
      </p>

      <ProductList />
    </div>
  );
};

export default Products;

//hacer el fetch a products y traer el listado de los productos 