"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Product } from "@/interfaces/Product";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://valkiriasback.onrender.com/products");
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      toast.error("Error al obtener los productos.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!productId) {
      toast.error("Por favor, selecciona un producto válido.");
      return;
    }

    const confirmation = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
    );

    if (!confirmation) return;

    try {
      const response = await fetch(
        `http://localhost:3000/products/delete/${productId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      toast.success("El producto ha sido eliminado exitosamente.");
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      toast.error("Error al eliminar el producto.");
    }
  };

  const handleEdit = (productId: string) => {
    if (!productId) {
      toast.error("Por favor, selecciona un producto válido.");
      return;
    }

    router.push(`/UpdateProduct/${productId}`);
  };

  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toString().includes(searchTerm)
      )
    : products;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Lista de Productos
      </h1>
      <input
        type="text"
        placeholder="Buscar por nombre o ID"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-gray-800">ID</th>
            <th className="border border-gray-300 p-2 text-gray-800">Nombre</th>
            <th className="border border-gray-300 p-2 text-gray-800">Precio</th>
            <th className="border border-gray-300 p-2 text-gray-800">Stock</th>
            <th className="border border-gray-300 p-2 text-gray-800">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2 text-gray-800">
                {product.id}
              </td>
              <td className="border border-gray-300 p-2 text-gray-800">
                {product.name}
              </td>
              <td className="border border-gray-300 p-2 text-gray-800">

                {product.prices[0]?.price}

              </td>
              <td className="border border-gray-300 p-2 text-gray-800">
                {product.stock}
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEdit(product.id)}
                  className="bg-blue-500 text-white py-1 px-2 rounded mr-2 hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
