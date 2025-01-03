"use client";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Product } from "@/interfaces/Product";
import ProductPreview from "./PreviewPorduct/page";

const CreateProduct: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Product>();

  const [photos, setPhotos] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [smallPrints, setSmallPrints] = useState<File[]>([]);
  const [largePrints, setLargePrints] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUniqueSize, setIsUniqueSize] = useState<boolean>(false);
  const [kidsSizes, setKidsSizes] = useState<string[]>([]);
  const [adultSizes, setAdultSizes] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [prices, setPrices] = useState<string[]>([]);
  const [stock, setStock] = useState<number | null>(null);
  const [color, setColor] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [smallPrintsPreview, setSmallPrintsPreview] = useState<string[]>([]);
  const [largePrintsPreview, setLargePrintsPreview] = useState<string[]>([]);

  const onSubmit = (data: Product) => {
    setLoading(true);

    if (!prices || prices.length < 2 || prices.some(price => !price)) {
      console.error("Prices are invalid or incomplete.");
      setLoading(false);
      return;
    }
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("prices", JSON.stringify(prices.filter((price) => price !== null && price !== undefined)));
    console.log(prices)
    formData.append("stock", data.stock.toString());
    formData.append("color", JSON.stringify(data.color));
    formData.append("category", category);

    const allSizes = [...kidsSizes, ...adultSizes];
    if (isUniqueSize) {
      allSizes.push("Talle Único");
    }

    if (allSizes.length > 0) {
      formData.append("size", JSON.stringify(allSizes));
    } else {
      console.error("No se seleccionaron talles.");
    }

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    smallPrints.forEach((print) => {
      formData.append("smallPrint", print);
    });

    largePrints.forEach((print) => {
      formData.append("largePrint", print);
    });

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
        console.log("Producto creado exitosamente:", data);
        setLoading(false);
        setIsModalVisible(true); // Mostrar el modal de éxito

        // Restablecer los estados solo después de que el modal se haya mostrado
        setTimeout(() => {
          reset();
          setSmallPrintsPreview([]);
          setLargePrintsPreview([]);
          setProductName("");
          setProductDescription("");
          setPhotos([]);
          setPreviewImages([]);
          setSmallPrints([]);
          setLargePrints([]);
          setKidsSizes([]);
          setAdultSizes([]);
          setIsUniqueSize(false);
          setPrices([]);
          setStock(null);
          setCategory("");
          setColor([]);
          setIsModalVisible(false); // Cerrar el modal después de un tiempo
        }, 3000); // Puedes ajustar el tiempo de espera según sea necesario
      })
      .catch((error) => {
        console.error("Error al crear el producto:", error);
        setLoading(false);
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
        case "priceKids":
          setPrices((prev) => {
            const updatedPrices = prev.length > 0 ? [...prev] : ["", ""]; // Asegúrate de que existan índices
            updatedPrices[0] = value;
            return updatedPrices;
          });
          break;
        case "priceAdults":
          setPrices((prev) => {
            const updatedPrices = prev.length > 0 ? [...prev] : ["", ""]; // Asegúrate de que existan índices
            updatedPrices[1] = value;
            return updatedPrices;
          });
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

  const handlePrintChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "small" | "large"
  ) => {
    const files = event.target.files;
    if (files) {
      const newPrints = Array.from(files);
      const newPrintsPreviews = newPrints.map((file) =>
        URL.createObjectURL(file)
      );

      if (type === "small") {
        setSmallPrints((prev) => [...prev, ...newPrints]);
        setSmallPrintsPreview((prev) => [...prev, ...newPrintsPreviews]);
      } else {
        setLargePrints((prev) => [...prev, ...newPrints]);
        setLargePrintsPreview((prev) => [...prev, ...newPrintsPreviews]);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPreviewImages((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const handleRemoveSmallPrint = (index: number) => {
    setSmallPrints((prev) => prev.filter((_, i) => i !== index));
    setSmallPrintsPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveLargePrint = (index: number) => {
    setLargePrints((prev) => prev.filter((_, i) => i !== index));
    setLargePrintsPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUniqueSizeChange = () => {
    setIsUniqueSize(!isUniqueSize);
  };

  const handleSizeChange = (size: string | number, type: "kids" | "adults") => {
    const updateSizes = type === "kids" ? setKidsSizes : setAdultSizes;

    updateSizes((prevSizes) =>
      prevSizes.includes(size as string)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size as string]
    );
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "¿Estás seguro de que deseas eliminar el producto y restablecer el formulario?"
    );
    if (confirmCancel) {
      reset();
      setPhotos([]);
      setPreviewImages([]);
      setSmallPrints([]);
      setLargePrints([]);
      setKidsSizes([]);
      setAdultSizes([]);

      setPrices([]);
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

        <div className="flex justify-between items-center space-x-4 mb-4">
          {/* Precio para niños */}
          <div className="w-1/4">
            <label htmlFor="priceKids" className="block text-sm font-medium">
              Precio Niños:
            </label>
            <input
              id="priceKids"
              type="number"
              {...register("priceKids")}
              placeholder="Precio para niños"
              className="w-full border-b-2 border-white bg-transparent p-1 text-white outline-none"
              onChange={(e) => {
                const value = e.target.value;
                setPrices((prev) => {
                  const updated = [...prev];
                  updated[0] = value; // Índice 0 para precio niños
                  return updated;
                });
              }}
            />
            {errors.priceKids && (
              <span className="text-red-500">Campo requerido</span>
            )}
          </div>

          {/* Precio para adultos */}
          <div className="w-1/4">
            <label htmlFor="priceAdults" className="block text-sm font-medium">
              Precio Adultos:
            </label>
            <input
              id="priceAdults"
              type="number"
              {...register("priceAdults")}
              placeholder="Precio para adultos"
              className="w-full border-b-2 border-white bg-transparent p-1 text-white outline-none"
              onChange={(e) => {
                const value = e.target.value;
                setPrices((prev) => {
                  const updated = [...prev];
                  updated[1] = value; // Índice 1 para precio adultos
                  return updated;
                });
              }}
            />
            {errors.priceAdults && (
              <span className="text-red-500">Campo requerido</span>
            )}
          </div>

          {/* Stock */}
          <div className="w-1/4">
            <label htmlFor="stock" className="block text-sm font-medium">
              Stock:
            </label>
            <input
              id="stock"
              type="number"
              {...register("stock", { required: true })}
              placeholder="Stock"
              className="w-full border-b-2 border-white bg-transparent p-1 text-white outline-none"
            />
            {errors.stock && (
              <span className="text-red-500">Campo requerido</span>
            )}
          </div>
        </div>

        {/* Tamaños */}
        <div className="flex space-x-8 mb-4">
          <div>
            <label className="block text-sm font-medium">Talle Único:</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                value="Unique"
                onChange={handleUniqueSizeChange}
                checked={isUniqueSize}
                className="mr-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Talle Niños:</label>
            <div className="flex space-x-2">
              {[4, 6, 8, 10, 12, 14, 16].map((size) => (
                <label key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    value={size}
                    onChange={() => handleSizeChange(size.toString(), "kids")}
                    checked={kidsSizes.includes(size.toString())}
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

        <div className="mb-4 flex items-start gap-8">
          {/* Colores */}
          <div>
            <label className="block text-sm font-medium mb-2">Colores:</label>
            <Controller
              name="color"
              control={control}
              defaultValue={color} // color es ahora un arreglo de strings
              render={({ field }) => (
                <div className="flex space-x-4">
                  {[
                    "#000000",
                    "#f5f5ef",
                    "#a6a6a6",
                    "#d80032",
                    "#05299e",
                    "#f7e90f",
                    "#00913f",
                  ].map((c) => (
                    <div
                      key={c}
                      onClick={() => {
                        const newColorArray = color.includes(c)
                          ? color.filter((selectedColor) => selectedColor !== c) // Elimina el color si ya está seleccionado
                          : [...color, c]; // Agrega el color si no está seleccionado
                        field.onChange(newColorArray);
                        setColor(newColorArray);
                      }}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                        color.includes(c)
                          ? "border-white"
                          : "border-transparent"
                      }`}
                    ></div>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Categoría */}
          <div className="w-1/2">
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-2"
            >
              Categoría:
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              <option
                value="Accesorios"
                className="text-black hover:bg-violet-500"
              >
                Accesorios
              </option>
              <option value="Combos" className="text-black hover:bg-violet-500">
                Combos
              </option>
            </select>
          </div>
        </div>

        {/* Agregar Imágenes */}
        <div className="mt-4">
          <label htmlFor="photos" className="block text-sm font-medium">
            Agregar imágenes:
          </label>
          <div className="relative">
            <input
              type="file"
              id="photos"
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
        </div>

        {/* Cargar Estampas */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="smallPrint" className="block text-sm font-medium">
              Cargar estampas pequeñas:
            </label>
            <div className="relative">
              <input
                type="file"
                id="smallPrint"
                multiple
                onChange={(e) => handlePrintChange(e, "small")}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById("smallPrint")?.click()}
                className="w-full bg-purple-dark text-white font-medium py-2 px-4 rounded-md shadow-md"
              >
                Cargar estampas pequeñas
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="largePrint" className="block text-sm font-medium">
              Cargar estampas grandes:
            </label>
            <div className="relative">
              <input
                type="file"
                id="largePrint"
                multiple
                onChange={(e) => handlePrintChange(e, "large")}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById("largePrint")?.click()}
                className="w-full bg-purple-dark text-white font-medium py-2 px-4 rounded-md shadow-md"
              >
                Cargar estampas grandes
              </button>
            </div>
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

      <ProductPreview
        productName={productName}
        productDescription={productDescription}
        prices={prices}
        stock={stock}
        category={category}
        color={color}
        isUniqueSize={isUniqueSize}
        kidsSizes={kidsSizes}
        adultSizes={adultSizes}
        previewImages={previewImages}
        onRemoveImage={handleRemoveImage}
        smallPrintsPreview={smallPrintsPreview}
        largePrintsPreview={largePrintsPreview}
        onRemoveSmallPrint={handleRemoveSmallPrint}
        onRemoveLargePrint={handleRemoveLargePrint}
      />
    </div>
  );
};

export default CreateProduct;
