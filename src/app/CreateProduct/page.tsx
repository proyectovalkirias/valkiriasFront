"use client"
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { Product } from '@/interfaces/Product';


const CreateProduct = () => {
  // Inicializar el formulario con TypeScript
  const { register, handleSubmit, control, formState: { errors } } = useForm<Product>();
  const [photos, setPhotos] = useState<File[]>([]);

  const onSubmit = (data: Product) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    data.sizes.forEach((size) => formData.append('sizes', size));
    photos.forEach((photo) => formData.append('photos', photo));

    fetch('http://localhost:3000/products', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Producto creado:', data);
      })
      .catch((error) => {
        console.error('Error al crear el producto:', error);
      });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setPhotos(Array.from(files));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow-md max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium">Nombre:</label>
        <input
          id="name"
          {...register('name', { required: 'El nombre es obligatorio' })}
          className="w-full p-2 border rounded"
        />
        {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium">Descripción:</label>
        <textarea
          id="description"
          {...register('description', { required: 'La descripción es obligatoria' })}
          className="w-full p-2 border rounded"
        />
        {errors.description && <div className="text-red-500 text-sm">{errors.description.message}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-medium">Precio:</label>
        <input
          id="price"
          type="number"
          {...register('price', { 
            required: 'El precio es obligatorio', 
            valueAsNumber: true, 
            min: { value: 0.01, message: 'Debe ser un número positivo' } 
          })}
          className="w-full p-2 border rounded"
        />
        {errors.price && <div className="text-red-500 text-sm">{errors.price.message}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="sizes" className="block text-sm font-medium">Tamaños (separados por coma):</label>
        <Controller
          name="sizes"
          control={control}
          defaultValue={[]}
          rules={{ required: 'Debes agregar al menos un tamaño' }}
          render={({ field }) => (
            <input
              id="sizes"
              type="text"
              onChange={(e) => field.onChange(e.target.value.split(','))}
              className="w-full p-2 border rounded"
            />
          )}
        />
        {errors.sizes && <div className="text-red-500 text-sm">{errors.sizes.message}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium">Categoría:</label>
        <input
          id="category"
          {...register('category', { required: 'La categoría es obligatoria' })}
          className="w-full p-2 border rounded"
        />
        {errors.category && <div className="text-red-500 text-sm">{errors.category.message}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="photos" className="block text-sm font-medium">Fotos:</label>
        <input
          id="photos"
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
      >
        Agregar Producto
      </button>
    </form>
  );
};

export default CreateProduct;
