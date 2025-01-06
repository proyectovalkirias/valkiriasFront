import Link from "next/link";

export default function SuccessMp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-600 mb-4">¡Pago Exitoso! 😎👌</h1>
      <p className="text-gray-700 mb-6">
        Gracias por tu compra. Hemos recibido tu pago correctamente.
      </p>
      <Link href="/">
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Volver al inicio
        </button>
      </Link>
    </div>
  );
}
