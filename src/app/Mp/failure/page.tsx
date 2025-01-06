import Link from "next/link";

export default function FailureMp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">¡Pago Fallido 😣!</h1>
      <p className="text-gray-700 mb-6">
        Hubo un problema con tu pago. Intenta nuevamente.
      </p>
      <Link href="/">
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Volver al inicio
        </button>
      </Link>
    </div>
  );
}
