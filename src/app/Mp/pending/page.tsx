import Link from "next/link";

export default function PendingMp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">Pago en proceso ⏳</h1>
      <p className="text-gray-700 mb-6">Estamos verificando tu pago. Por favor, espera un momento.</p>
      <Link href="/">
        <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
          Volver al inicio
        </button>
      </Link>
    </div>
  );
}
