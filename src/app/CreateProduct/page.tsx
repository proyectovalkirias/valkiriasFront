"use client";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Product } from "@/interfaces/Product";
import { ProductPreview } from "@/components/ProductPreview";
import { toast } from "react-hot-toast";


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
  const [isCustomizable, setIsCustomizable] = useState<boolean>(true);
  const [, setPrice] = useState<string[]>([]);
  const [stock, setStock] = useState<number | null>(null);
  const [sizePriceMapping, setSizePriceMapping] = useState<
    { size: string; price: number }[]
  >([]);
  const [color, setColor] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [smallPrintsPreview, setSmallPrintsPreview] = useState<string[]>([]);
  const [largePrintsPreview, setLargePrintsPreview] = useState<string[]>([]);

  const onSubmit = (data: Product) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("prices", JSON.stringify(sizePriceMapping));
    console.log(sizePriceMapping, "prices");
    formData.append("stock", data.stock.toString());
    formData.append("color", data.color.join(",")); 
    formData.append("category", category);
    formData.append("isCustomizable", isCustomizable.toString());
    const allSizes = [...kidsSizes, ...adultSizes];
    if (isUniqueSize) {
      allSizes.push("Talle Único");
    }
    formData.append("size", allSizes.join(",")); 

    console.log("size", allSizes);

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });
    
    smallPrints.forEach((print) => {
      formData.append("smallPrint", print);
    });
    
    largePrints.forEach((print) => {
      formData.append("largePrint", print);
    });
    
    console.log("FormData values:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    // const getToken = () => {
    //   const user = localStorage.getItem("user");
      
    //   if (!user) {
    //     console.error("No hay datos del usuario en localStorage");
    //     return null;
    //   }

    //   try {
    //     const parsedUser = JSON.parse(user);
    //     return parsedUser.token || null; // Retorna el token si existe
    //   } catch (err) {
    //     console.error("Error al parsear los datos del usuario:", err);
    //     return null;
    //   }
    // };

    // const token = getToken(); // Obtén el token desde localStorage
    // if (!token) {
    //   toast.error("No se encontró el token. Por favor, inicia sesión nuevamente.");
    //   setLoading(false);
    //   return;
    // }
  
    fetch("https://valkiriasback.onrender.com/products", {
      method: "POST",
      body: formData,
      // headers: {
      //    Authorization: `Bearer ${token}`,
      // },
    })
    .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Producto creado exitosamente", data);
        setLoading(false);
        setIsModalVisible(true);

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
          setPrice([]);
          setStock(null);
          setCategory("");
          setColor([]);
          setIsModalVisible(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error al crear el producto:", error);
        toast.error(
          "Error al crear el producto. Por favor, intente nuevamente."
        );
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
      case "prices":
        setPrice([value]);
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

  const handleSizePriceChange = (size: string, price: number) => {
    setSizePriceMapping((prevMapping) => {
      const existingEntryIndex = prevMapping.findIndex(
        (entry) => entry.size === size
      );
      if (existingEntryIndex !== -1) {
        const updatedMapping = [...prevMapping];
        updatedMapping[existingEntryIndex].price = price;
        return updatedMapping;
      } else {
        return [...prevMapping, { size, price }];
      }
    });
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "¿Estás seguro de que deseas eliminar el producto y restablecer el formulario?"
    );
    if (confirmCancel) {
      toast("Producto eliminado y formulario reiniciado.", { icon: "🗑️" });
      reset();
      setPhotos([]);
      setPreviewImages([]);
      setSmallPrints([]);
      setLargePrints([]);
      setKidsSizes([]);
      setAdultSizes([]);
      setPrice([]);
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

        <div className="flex justify-items-stretch space-x-4 mb-4 text-white">
  <div className="w-2/3">
    <h3 className="text-lg font-semibold mb-2">Tallas y Precios:</h3>
    <div className="space-y-2 bg-transparent p-4 rounded-lg shadow-lg">
      {[
        ...kidsSizes,
        ...adultSizes,
        ...(isUniqueSize ? ["Talle Único"] : []),
      ].map((size, index) => (
        <div key={index} className="flex items-center justify-between space-x-4">
          <span className="text-sm font-medium">{size}</span>
          <input
            type="number"
            placeholder={`Precio para ${size}`}
            onChange={(e) =>
              handleSizePriceChange(size, parseFloat(e.target.value) || 0)
            }
            className="border border-white rounded-md p-2 bg-transparent text-white focus:ring-2 "
          />
        </div>
      ))}
    </div>
  </div>

  <div className="w-1/3">
    <label
      htmlFor="stock"
      className="block text-sm font-medium text-white mb-1"
    >
      Stock:
    </label>
    <input
      id="stock"
      type="number"
      {...register("stock", { required: true })}
      value={stock || ""}
      onChange={handleChange}
      placeholder="Stock"
      className="w-full border-b-2 border-white-300 bg-transparent p-2 text-white outline-none"
    />
  </div>
</div>

<div className="flex space-x-8 mb-4">
  <div>
    <label className="block text-sm font-medium text-white">Talle Único:</label>
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
    <label className="block text-sm font-medium text-white">Talle Niños:</label>
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
          <span className="text-white">{size}</span>
        </label>
      ))}
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-white">Talle Adultos:</label>
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
          <span className="text-white">{size}</span>
        </label>
      ))}
    </div>
  </div>
</div>


        <div className="mb-4 flex items-start gap-8">
          <div>
            <label className="block text-sm font-medium mb-2">Colores:</label>
            <Controller
              name="color"
              control={control}
              defaultValue={color}
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
                          ? color.filter((selectedColor) => selectedColor !== c)
                          : [...color, c];
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
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isCustomizable}
                onChange={() => setIsCustomizable((prev) => !prev)}
                className="w-4 h-4 text-violet-500 border-gray-300 rounded focus:ring-violet-500"
              />
              <span className="text-sm font-medium">Personalizable</span>
            </label>
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
