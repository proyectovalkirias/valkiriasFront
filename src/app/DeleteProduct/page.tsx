"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const DeleteProduct: React.FC = () => {
  const [productId, setProductId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const deleteProduct = async () => {
    if (!productId) {
      Swal.fire({
        icon: "warning",
        title: "Por favor, ingresa un ID de producto válido.",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/products/delete/${productId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al eliminar el producto",
        });
        throw new Error("Error al eliminar el producto");
      }

      Swal.fire({
        icon: "success",
        title: "Producto eliminado",
        text: "El producto ha sido eliminado exitosamente",
      });
      router.push("/Admin"); // Redirigir al panel de administración
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al eliminar el producto",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-[#7b548b] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Eliminar Producto</h1>
      <div className="mb-4">
        <label htmlFor="productId" className="block text-sm font-medium mb-2">
          Ingrese el ID del Producto:
        </label>
        <input
          id="productId"
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
          placeholder="ID del Producto"
        />
      </div>
      <button
        onClick={deleteProduct}
        disabled={loading}
        className="bg-purple-300 text-white py-2 px-4 rounded hover:bg-purple-400"
      >
        {loading ? "Eliminando..." : "Eliminar Producto"}
      </button>
    </div>
  );
};

export default DeleteProduct;
