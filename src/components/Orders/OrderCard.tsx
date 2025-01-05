import { IUserOrder } from "@/interfaces/index";
import Link from "next/link";  // Usamos `Link` de Next.js para la redirección

interface IOrderCardProps {
  order: IUserOrder;
}

const OrderCard: React.FC<IOrderCardProps> = ({ order }) => {
  const orderDate = new Date(order.date);
  const isValidDate = !isNaN(orderDate.getTime()); // Verifica si es una fecha válida

  const handleOrderStatus = () => {
    // Este botón aún no hace nada
    alert("Estado de la compra aún no implementado.");
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-8 bg-white shadow-lg rounded-lg flex flex-col gap-6 mb-6 max-w-4xl mx-auto">
      {/* Header */}
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center">
        Purchase ID: {order.id}
      </h3>

      <div className="space-y-2 text-center">
        <p className="text-sm sm:text-base text-gray-500">
          Status: <span className="font-bold text-gray-700">{order.status?.toUpperCase() || "N/A"}</span>
        </p>
        <p className="text-sm sm:text-base text-gray-500">
          Date: <span className="font-bold text-gray-700">{isValidDate ? orderDate.toLocaleDateString() : "Invalid date"}</span>
        </p>
        <p className="text-sm sm:text-base text-gray-500">
          {order.products && order.products.length > 0 
            ? `${order.products.length} ${order.products.length === 1 ? "product" : "products"}`
            : ""}
        </p>
      </div>

      {/* Products Section */}
      <div className="space-y-4">
        {order.products && order.products.length > 0 ? (
          order.products.map((product, index) => (
            <div key={index} className="flex flex-col gap-4 p-4 sm:p-6 bg-gray-100 rounded-lg shadow-inner">
              <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">{product.name || "Unknown Product"}</h4>

              {/* Product Images */}
              <div className="flex gap-4 overflow-x-auto sm:overflow-visible sm:flex-wrap sm:gap-6 md:gap-8">
                {product.photos && product.photos.length > 0 ? (
                  product.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={product.name || "Product Image"}
                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-md"
                    />
                  ))
                ) : (
                  <p className="text-sm sm:text-base text-gray-400">No photos available</p>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-2 text-gray-600">
                <p><strong>Description:</strong> {product.description || "No description available"}</p>
                <p><strong>Category:</strong> {product.category || "N/A"}</p>

                <div className="flex flex-wrap gap-4">
                  <p><strong>Size:</strong> {product.size?.join(", ") || "N/A"}</p>
                  <p><strong>Color:</strong> {product.color?.join(", ") || "N/A"}</p>
                </div>

                {/* Price */}
                {product.prices && product.prices.length > 0 ? (
                  <p className="text-lg sm:text-xl font-bold text-green-600">
                    Price: {product.prices.join(", ") || "N/A"}
                  </p>
                ) : (
                  <p className="text-sm sm:text-base text-gray-500">Price not available</p>
                )}

                {/* Stock */}
                <p className={`text-sm sm:text-base font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
                </p>
              </div>

              {/* Print Sections */}
              {product.smallPrint && product.smallPrint.length > 0 && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg text-sm sm:text-base text-gray-500">
                  <strong>Small Prints:</strong>
                  <ul className="list-disc pl-4">
                    {product.smallPrint.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.largePrint && product.largePrint.length > 0 && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg text-sm sm:text-base text-gray-500">
                  <strong>Large Prints:</strong>
                  <ul className="list-disc pl-4">
                    {product.largePrint.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : null}
      </div>

      {/* Buttons Section */}
      <div className="flex gap-4 justify-center mt-6">
        {/* Follow-up purchase button */}
        <Link 
          href="/products"
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Seguir comprando!
        </Link>

        {/* Order status button */}
        <button 
          onClick={handleOrderStatus} 
          className="bg-purple-300 text-white py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors duration-300"
          >
          <img 
            src="/images/order-tracking.png" 
            alt="Estado de la compra" 
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
          />
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
