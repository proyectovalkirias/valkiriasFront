// ProductPreview.tsx
import React from "react";

const ProductPreview: React.FC<{
  productName: string;
  productDescription: string;
  prices: string[];
  stock: number | null;
  category: string;
  color: string[];
  isUniqueSize: boolean;
  kidsSizes: string[];
  adultSizes: string[];
  previewImages: string[];
  onRemoveImage: (index: number) => void;
  smallPrintsPreview: string[];
  largePrintsPreview: string[];
  onRemoveSmallPrint: (index: number) => void;  // Nueva prop
  onRemoveLargePrint: (index: number) => void;  // Nueva prop
}> = ({
  productName,
  productDescription,
  prices,
  stock,
  category,
  color,
  isUniqueSize,
  kidsSizes,
  adultSizes,
  previewImages,
  onRemoveImage,
  smallPrintsPreview,
  largePrintsPreview,
  onRemoveSmallPrint,  // Nueva prop
  onRemoveLargePrint,  // Nueva prop
}) => {
  return (
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
        <div className="flex gap-4">
          <p className="text-sm">Precio: ${prices !== null ? prices : "0.00"}</p>
          <p className="text-sm">Stock: {stock !== null ? stock : "0"}</p>
        </div>

        {/* Categoría y Color */}
        <div className="flex gap-4">
          <p className="text-sm">Categoría: {category || "Ninguna"}</p>
          <div className="flex items-center gap-1">
            <p className="text-sm">Color:</p>
            <div className="flex gap-2">
              {color.length > 0 ? (
                color.map((c, index) => (
                  <span
                    key={index}
                    style={{ backgroundColor: c }}
                    className="inline-block w-4 h-4 rounded-full"
                  ></span>
                ))
              ) : (
                <p>No se seleccionaron colores</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-2 text-center">
            Tamaños seleccionados:
          </h4>
          <div className="flex gap-4">
          <p className="text-sm">
            Único: {isUniqueSize ? 'Talle único' : "Ninguno"}
            </p>
            <p className="text-sm">
              Niños: {kidsSizes.length ? kidsSizes.join(", ") : "Ninguno"}
            </p>
            <p className="text-sm">
              Adultos: {adultSizes.length ? adultSizes.join(", ") : "Ninguno"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium">Imágenes de Producto:</h4>
          <div className="flex space-x-2 mt-2">
            {previewImages.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`Vista previa ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Imágenes de Estampas Pequeñas */}
        <div className="mt-4">
          <h4 className="font-medium">Imágenes de Estampas Pequeñas:</h4>
          <div className="flex space-x-2 mt-2">
            {smallPrintsPreview.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`Estampa pequeña ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <button
                  onClick={() => onRemoveSmallPrint(index)}  // Elimina imagen de estampa pequeña
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Imágenes de Estampas Grandes */}
        <div className="mt-4">
          <h4 className="font-medium">Imágenes de Estampas Grandes:</h4>
          <div className="flex space-x-2 mt-2">
            {largePrintsPreview.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`Estampa grande ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <button
                  onClick={() => onRemoveLargePrint(index)}  // Elimina imagen de estampa grande
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
  );
};

export default ProductPreview;