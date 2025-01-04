"use client";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/interfaces/Product";
import Swal from "sweetalert2";

const UpdateProduct: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Product>();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`);
      if (!response.ok) {
        throw new Error("Error fetching product");
      }
      const data = await response.json();
      setProduct(data);
      prefillForm(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error fetching product",
      });
    }
  };

  const prefillForm = (productData: Product) => {
    setValue("name", productData.name);
    setValue("description", productData.description);
    setValue("prices", productData.prices);
    setValue("stock", productData.stock);
    setValue("color", productData.color);
    setValue("category", productData.category);
    setValue("photos", productData.photos);
    setValue("smallPrint", productData.smallPrint);
    setValue("largePrint", productData.largePrint);
    setValue("isAvailable", productData.isAvailable);
    setValue("size", productData.size);
  };

  const onSubmit = async (data: Product) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/products/update/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error updating product",
        });
        throw new Error("Error updating product");
      }

      Swal.fire({
        icon: "success",
        title: "Producto actualizado",
        text: "El producto ha sido actualizado exitosamente",
      });
      router.push("/Admin");
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div>Cargando producto...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-[#7b548b] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Modificar Producto</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2 text-white"
          >
            Nombre del Producto
          </label>
          <input
            id="name"
            {...register("name", { required: "Este campo es obligatorio" })}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="Nombre"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2 text-white"
          >
            Descripción
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Este campo es obligatorio",
            })}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="Descripción"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="prices"
            className="block text-sm font-medium mb-2 text-white"
          >
            Precio
          </label>
          <input
            id="prices"
            type="text"
            {...register("prices", { required: "Este campo es obligatorio" })}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="Precio"
          />
          {errors.prices && (
            <p className="text-red-500 text-sm">{errors.prices.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="stock"
            className="block text-sm font-medium mb-2 text-white"
          >
            Stock
          </label>
          <input
            id="stock"
            type="number"
            {...register("stock", { required: "Este campo es obligatorio" })}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="Stock"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium mb-2 text-white"
          >
            Categoría
          </label>
          <input
            id="category"
            {...register("category", { required: "Este campo es obligatorio" })}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="Categoría"
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="size"
            className="block text-sm font-medium mb-2 text-white"
          >
            Tamaños
          </label>
          <input
            id="size"
            {...register("size")}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="Tamaños (separados por comas)"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="color"
            className="block text-sm font-medium mb-2 text-white"
          >
            Colores
          </label>
          <input
            id="color"
            {...register("color")}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="Colores (separados por comas)"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="photos"
            className="block text-sm font-medium mb-2 text-white"
          >
            Fotos
          </label>
          <input
            id="photos"
            {...register("photos")}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="URLs de fotos (separadas por comas)"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="smallPrint"
            className="block text-sm font-medium mb-2 text-white"
          >
            Estampa pequeña
          </label>
          <input
            id="smallPrint"
            {...register("smallPrint")}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="URLs de pequeño impreso (separadas por comas)"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="largePrint"
            className="block text-sm font-medium mb-2 text-white"
          >
            Estampa grande
          </label>
          <input
            id="largePrint"
            {...register("largePrint")}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="URLs de grande impreso (separadas por comas)"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="isAvailable"
            className="block text-sm font-medium mb-2 text-white"
          >
            Disponible
          </label>
          <input
            type="checkbox"
            id="isAvailable"
            {...register("isAvailable")}
            className="mb-4"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-300 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-purple-400"
        >
          {loading ? "Actualizando..." : "Actualizar Producto"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
