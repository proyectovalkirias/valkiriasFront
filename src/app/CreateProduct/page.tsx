"use client";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { Product } from "@/interfaces/Product";

const CreateProduct: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Product>({defaultValues: { color: [] },});

  const [photos, setPhotos] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [kidsSizes, setKidsSizes] = useState<number[]>([]);
  const [adultSizes, setAdultSizes] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [colors, setColors] = useState<string[]>([]); // Inicializar con negro por defecto
  const [category, setCategory] = useState<string>("");
  // const [isSuccess, setIsSuccess] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onSubmit = (data: Product) => {
    console.log("Formulario enviado", data);
    console.log("Colores seleccionados antes del envío:", colors);
    setLoading(true);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.price !== null) {
      formData.append("price", data.price.toString());
    }
    if (data.stock !== null) {
      formData.append("stock", data.stock.toString());
    }
    colors.forEach((color) => formData.append("colors", color));
    formData.append("category", category || "Sin categoría");

    photos.forEach((photo) => formData.append("photos", photo));

    const allSizes = [...kidsSizes.map(String), ...adultSizes];
    allSizes.forEach((size) => formData.append("sizes", size));

    fetch("http://localhost:3000/products", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Producto creado:", data);
        setLoading(false);
        reset();
        setPhotos([]);
        // setIsSuccess(true);
        setIsModalVisible(true);
        setPreviewImages([]);
        setKidsSizes([]);
        setAdultSizes([]);
        setPrice(null);
        setStock(null);
        setCategory("");
        setColors(["#000000"]);
      })
      .catch((error) => {
        console.error("Error al crear el producto:", error);
        setLoading(false);
        // setIsSuccess(false);
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setProductName(value);
        break;
      case "description":
        setProductDescription(value);
        break;
      case "price":
        setPrice(value ? parseFloat(value) : null);
        break;
      case "stock":
        setStock(value ? parseInt(value) : null);
        break;
      default:
        break;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      setPreviewImages((prevPreviews) => [
        ...prevPreviews,
        ...newPhotos.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPreviewImages((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const toggleColor = (selectedColor: string) => {
    setColors((prevColors) => {
      if (prevColors.includes(selectedColor)) {
        return prevColors.filter((color) => color !== selectedColor);
      } else {
        return [...prevColors, selectedColor];
      }
    });
  };
  
  useEffect(() => {
    setValue("color", colors);  // Sincroniza el valor de colors con react-hook-form
  }, [colors, setValue]);
  
  const handleSizeChange = (size: string | number, type: "kids" | "adults") => {
    if (type === "kids") {
      setKidsSizes((prevSizes) =>
        prevSizes.includes(size as number)
          ? prevSizes.filter((s) => s !== size)
          : [...prevSizes, size as number]
      );
    } else {
      setAdultSizes((prevSizes) =>
        prevSizes.includes(size as string)
          ? prevSizes.filter((s) => s !== size)
          : [...prevSizes, size as string]
      );
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "¿Estás seguro de que deseas eliminar el producto y restablecer el formulario?"
    );

    if (confirmCancel) {
      reset();
      setPhotos([]);
      setPreviewImages([]);
      setKidsSizes([]);
      setAdultSizes([]);
      setPrice(null);
      setStock(null);
      setCategory("");
    }
  };

  return (
    <div className="flex w-full bg-[#7b548b] min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col p-4 w-1/2 text-white"
      >
        {/* Modal de éxito */}
        {isModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-creativity-purple p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold text-center">
                Producto creado correctamente!
              </h3>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setIsModalVisible(false)} // Ocultar el modal al hacer clic en "OK"
                  className="bg-[#5e3a6e] text-white px-4 py-2 rounded-md hover:bg-purple-dark"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        <h2 className="mb-6 text-3xl font-bold text-center">
          Creación Producto
        </h2>

        {/* Campo Nombre */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Nombre:
          </label>
          <input
            id="name"
            {...register("name", { required: true })}
            value={productName}
            onChange={handleChange}
            placeholder="Nombre del producto"
            className="w-full border-b-2 border-white bg-transparent p-2 text-white outline-none"
          />
        </div>

        {/* Campo Descripción */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium">
            Descripción:
          </label>
          <textarea
            id="description"
            {...register("description", { required: true })}
            value={productDescription}
            onChange={handleChange}
            placeholder="Descripción del producto"
            className="w-full border-b-2 border-white bg-transparent p-2 text-white outline-none"
          />
        </div>

        {/* Precio y Stock */}
        <div className="flex justify-items-stretch space-x-4 mb-4">
          <div className="w-1/3">
            <label htmlFor="price" className="block text-sm font-medium">
              Precio:
            </label>
            <input
              id="price"
              type="number"
              {...register("price", { required: true })}
              onChange={handleChange}
              placeholder="Precio"
              className="w-full border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />
          </div>

          <div className="w-1/3">
            <label htmlFor="stock" className="block text-sm font-medium">
              Stock:
            </label>
            <input
              id="stock"
              type="number"
              {...register("stock", { required: true })}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />
          </div>
        </div>

        {/* Colores */}
        <div className="mb-4">
          <label htmlFor="color" className="block text-sm font-medium">
            Colores:
          </label>
          <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <div className="flex space-x-4">
              {["#000000", "#f5f5ef", "#a6a6a6"].map((c) => (
                <div
                  key={c}
                  onClick={() => {
                    toggleColor(c);
                    // Actualizamos los valores de color en el formulario
                    field.onChange(colors); // Asegura que react-hook-form se actualice con los colores seleccionados
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                    colors.includes(c) ? "border-white" : "border-transparent"
                  }`}
                ></div>
              ))}
            </div>
          )}
          />
        </div>

        {/* Tamaños */}
        <div className="flex space-x-8 mb-4">
          <div>
            <label className="block text-sm font-medium">Talle Niños:</label>
            <div className="flex space-x-2">
              {[4, 6, 8, 10, 12, 14, 16].map((size) => (
                <label key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    value={size}
                    onChange={() => handleSizeChange(size, "kids")}
                    checked={kidsSizes.includes(size)}
                    className="mr-1"
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Talle Adultos:</label>
            <div className="flex space-x-2">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <label key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    value={size}
                    onChange={() => handleSizeChange(size, "adults")}
                    checked={adultSizes.includes(size)}
                    className="mr-1"
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Categoría y Agregar Imágenes */}
        <div className="mb-4 flex items-center gap-4">
          {/* Categoría */}
          <div className="w-1/2">
            <label htmlFor="category" className="block text-sm font-medium">
              Categoría:
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full border-b-2 border-white bg-transparent p-2 text-white outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="" className="text-black">
                Seleccione una categoría
              </option>
              <option
                value="Remeras"
                className="text-black hover:bg-violet-500"
              >
                Remeras
              </option>
              <option value="Buzos" className="text-black hover:bg-violet-500">
                Buzos
              </option>
              <option value="Gorras" className="text-black hover:bg-violet-500">
                Gorras
              </option>
              <option
                value="Gorros de lana"
                className="text-black hover:bg-violet-500"
              >
                Gorros de Lana
              </option>
              <option
                value="Totebags"
                className="text-black hover:bg-violet-500"
              >
                Totebags
              </option>
            </select>
          </div>

          {/* Agregar Imágenes */}
          <div className="w-1/2">
            <label htmlFor="photos" className="block text-sm font-medium">
              Agregar imágenes:
            </label>
            <div className="relative">
              <input
                id="photos"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById("photos")?.click()}
                className="w-full bg-purple-dark text-white font-medium py-2 px-4 rounded-md shadow-md"
              >
                Cargar imágenes
              </button>
            </div>
            {/* {isSuccess && (
        <div className="bg-green-500 text-white p-3 rounded-md mb-4">
          Producto creado correctamente!
        </div>
      )} */}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-between items-center gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/3 bg-custom-orange text-white font-medium py-2 px-3 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-2/3 bg-creativity-purple text-white font-medium py-2 px-4 rounded-md"
          >
            {loading ? "Cargando..." : "Crear Producto"}
          </button>
        </div>
      </form>

      {/* Vista previa */}
      <div className="w-1/2 p-4 text-white">
        <h2 className="mb-6 text-2xl font-bold text-center">Vista Previa</h2>

        <div className="bg-[#5e3a6e] p-4 rounded-md flex flex-col items-center justify-center gap-4">
          {/* Nombre */}
          <h3 className="text-lg font-semibold">
            {productName || "Nombre del Producto"}
          </h3>

          {/* Descripción */}
          <p className="text-sm text-center">
            {productDescription || "Descripción del producto"}
          </p>

          {/* Precio y Stock */}
          {/* Categoría y Colores */}
          <div className="flex flex-col gap-2 items-center">
            <p className="text-sm">Categoría: {category || "Ninguna"}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm">Colores:</p>
              <div className="flex gap-2">
                {colors.map((color, index) => (
                  <span
                    key={index}
                    style={{ backgroundColor: color }}
                    className="inline-block w-4 h-4 rounded-full border-2 border-white"
                    title={color}
                  ></span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2 text-center">
              Tamaños seleccionados:
            </h4>
            <div className="flex gap-4">
              <p className="text-sm">
                Niños: {kidsSizes.length ? kidsSizes.join(", ") : "Ninguno"}
              </p>
              <p className="text-sm">
                Adultos: {adultSizes.length ? adultSizes.join(", ") : "Ninguno"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Imágenes:</h4>
            <div className="flex space-x-2 mt-2">
              {previewImages.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`Vista previa ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
