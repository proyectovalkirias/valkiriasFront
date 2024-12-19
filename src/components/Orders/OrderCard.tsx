import { IUserOrder } from "@/interfaces/index";

interface IOrderCardProps {
  order: IUserOrder;
}

const OrderCard: React.FC<IOrderCardProps> = ({ order }) => {
  return (
    <div className="p-6 bg-white shadow-[0_3px_20px_-10px_rgba(6,81,237,0.4)] rounded-lg flex flex-col gap-4 mb-4">
      <h3 className="text-xl font-semibold text-gray-800 text-center">
        Purchase ID: {order.id}
      </h3>

      <div className="space-y-2 text-center">
        <p className="text-sm text-gray-500">
          Status: <span className="font-bold text-gray-700">{order.status.toUpperCase()}</span>
        </p>
        <p className="text-sm text-gray-500">
          Date: <span className="font-bold text-gray-700">{new Date(order.date).toLocaleDateString()}</span>
        </p>
        <p className="text-sm text-gray-500">
          {order.products.length}{" "}
          {order.products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-inner text-sm text-gray-600">
        {order.products.map((product, index) => (
          <p key={index} className="truncate">
            {index + 1}. {product.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default OrderCard;