"use client";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Product } from "@/interfaces/Product";
import { useRouter } from "next/navigation";
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
  const [productId, setProductId] = useState<string>("");
  const [isProductLoaded, setIsProductLoaded] = useState(false);
  const router = useRouter();

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/products/${productId}`
      );
      if (!response.ok) {
        throw new Error("Error fetching product");
      }
      const data = await response.json();
      setProduct(data);
      prefillForm(data);
      setIsProductLoaded(true);
    } catch (error) {
      console.error("Error fetching product:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error fetch product",
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

      console.log("Producto actualizado exitosamente");
      Swal.fire({
        icon: "success",
        title: "Producto actualizado",
        text: "El producto ha sido actualizado exitosamente",
      });
      router.push("/Admin"); // Redirigir al panel de administración
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isProductLoaded) {
    return (
      <div className="flex flex-col items-center p-6 bg-[#7b548b] min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Modificar Producto</h1>
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
          onClick={fetchProduct}
          className="bg-purple-300 text-white py-2 px-4 rounded hover:bg-purple-400"
        >
          Cargar Producto
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-[#7b548b]">
      <h1 className="text-2xl font-bold mb-6">Modificar Producto</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
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
            className="block text-sm font-medium mb-2"
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
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Precio
          </label>
          <input
            id="price"
            type="string"
            {...register("prices", { required: "Este campo es obligatorio" })}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="Precio"
          />
          {errors.prices && (
            <p className="text-red-500 text-sm">{errors.prices.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="size" className="block text-sm font-medium mb-2">
            Talles
          </label>
          <input
            id="size"
            type="string"
            {...register("size", { required: "Este campo es obligatorio" })}
            className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
            placeholder="Talles"
          />
          {errors.size && (
            <p className="text-red-500 text-sm">{errors.size.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="block text-sm font-medium mb-2">
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
          <label htmlFor="category" className="block text-sm font-medium mb-2">
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
          <label htmlFor="color" className="block text-sm font-medium mb-2">
            Colores
          </label>
          <Controller
            name="color"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <input
                id="color"
                className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
                placeholder="Colores separados por comas (ej. rojo, azul)"
                value={field.value.join(", ")}
                onChange={(e) =>
                  field.onChange(
                    e.target.value.split(",").map((color) => color.trim())
                  )
                }
              />
            )}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="photos" className="block text-sm font-medium mb-2">
            Imágenes del producto
          </label>
          <Controller
            name="photos"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <textarea
                id="photos"
                className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
                placeholder="URLs de imágenes separadas por comas"
                value={field.value.join(", ")}
                onChange={(e) =>
                  field.onChange(
                    e.target.value.split(",").map((url) => url.trim())
                  )
                }
              />
            )}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="smallPrint"
            className="block text-sm font-medium mb-2"
          >
            Estampas pequeñas
          </label>
          <Controller
            name="smallPrint"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <textarea
                id="smallPrint"
                className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
                placeholder="URLs separadas por comas"
                value={field.value.join(", ")}
                onChange={(e) =>
                  field.onChange(
                    e.target.value.split(",").map((url) => url.trim())
                  )
                }
              />
            )}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="largePrint"
            className="block text-sm font-medium mb-2"
          >
            Estampas grandes
          </label>
          <Controller
            name="largePrint"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <textarea
                id="largePrint"
                className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
                placeholder="URLs separadas por comas"
                value={field.value.join(", ")}
                onChange={(e) =>
                  field.onChange(
                    e.target.value.split(",").map((url) => url.trim())
                  )
                }
              />
            )}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="isAvailable"
            className="block text-sm font-medium mb-2"
          >
            ¿Disponible para la venta?
          </label>
          <Controller
            name="isAvailable"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <select
                id="isAvailable"
                className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
                value={field.value ? "true" : "false"}
                onChange={(e) =>
                  field.onChange(e.target.value === "true" ? true : false)
                }
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            )}
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
