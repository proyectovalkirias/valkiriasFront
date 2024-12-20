import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Product } from "@/interfaces/Product"

const CreateProduct2: React.FC = () => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(5, "El nombre debe tener al menos 5 caracteres.")
      .max(50, "El nombre no puede superar los 50 caracteres.")
      .required("El nombre es obligatorio."),
    description: Yup.string()
      .min(10, "La descripción debe tener al menos 10 caracteres.")
      .max(150, "La descripción no puede superar los 150 caracteres.")
      .required("La descripción es obligatoria."),
    price: Yup.number()
      .min(0, "El precio debe ser positivo.")
      .required("El precio es obligatorio."),
    sizes: Yup.array()
      .of(Yup.string().required("Debes seleccionar al menos un tamaño."))
      .required("Debes seleccionar al menos un tamaño."),
    category: Yup.string().required("La categoría es obligatoria."),
    photos: Yup.array()
      .of(Yup.string().url("Debe ser una URL válida."))
      .required("Debes agregar al menos una foto."),
    stock: Yup.number()
      .min(0, "El stock debe ser positivo.")
      .required("El stock es obligatorio."),
    color: Yup.array()
      .of(Yup.string().required("Debes seleccionar al menos un color."))
      .required("Debes seleccionar al menos un color."),
    isAvailable: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      sizes: [],
      category: "",
      photos: [],
      stock: 0,
      color: [],
      isAvailable: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:3000/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Producto creado exitosamente:", result);
        alert("Producto creado exitosamente.");
      } catch (error) {
        console.error("Error al crear el producto:", error);
        alert("Hubo un error al crear el producto.");
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Crear Producto</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="font-medium">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="p-2 border rounded-md"
            placeholder="Ingresa el nombre del producto"
          />
          {formik.touched.name && formik.errors.name ? (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="font-medium">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className="p-2 border rounded-md"
            placeholder="Describe el producto"
          />
          {formik.touched.description && formik.errors.description ? (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label htmlFor="price" className="font-medium">
            Precio
          </label>
          <input
            id="price"
            name="price"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
            className="p-2 border rounded-md"
            placeholder="Ingresa el precio del producto"
          />
          {formik.touched.price && formik.errors.price ? (
            <p className="text-red-500 text-sm">{formik.errors.price}</p>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label htmlFor="category" className="font-medium">
            Categoría
          </label>
          <input
            id="category"
            name="category"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category}
            className="p-2 border rounded-md"
            placeholder="Ingresa la categoría del producto"
          />
          {formik.touched.category && formik.errors.category ? (
            <p className="text-red-500 text-sm">{formik.errors.category}</p>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label htmlFor="sizes" className="font-medium">
            Tamaños
          </label>
          <input
            id="sizes"
            name="sizes"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.sizes}
            className="p-2 border rounded-md"
            placeholder="Ingresa los tamaños disponibles (separados por coma)"
          />
          {formik.touched.sizes && formik.errors.sizes ? (
            <p className="text-red-500 text-sm">{formik.errors.sizes}</p>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label htmlFor="color" className="font-medium">
            Colores
          </label>
          <input
            id="color"
            name="color"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.color}
            className="p-2 border rounded-md"
            placeholder="Ingresa los colores disponibles (separados por coma)"
          />
          {formik.touched.color && formik.errors.color ? (
            <p className="text-red-500 text-sm">{formik.errors.color}</p>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label htmlFor="photos" className="font-medium">
            Fotos
          </label>
          <input
            id="photos"
            name="photos"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.photos}
            className="p-2 border rounded-md"
            placeholder="Ingresa las URLs de las fotos (separadas por coma)"
          />
          {formik.touched.photos && formik.errors.photos ? (
            <p className="text-red-500 text-sm">{formik.errors.photos}</p>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label htmlFor="stock" className="font-medium">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.stock}
            className="p-2 border rounded-md"
            placeholder="Ingresa el stock del producto"
          />
          {formik.touched.stock && formik.errors.stock ? (
            <p className="text-red-500 text-sm">{formik.errors.stock}</p>
          ) : null}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Crear Producto
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct2;
