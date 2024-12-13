const CategorySection: React.FC<{ title: string; products: any[] }> = ({
  title,
  products,
}) => {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex flex-col justify-between"
          >
            <div className="h-32 bg-gray-200 mb-4"></div>
            <div className="text-sm mb-2">Descripción</div>
            <button className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">
              Ver más
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
