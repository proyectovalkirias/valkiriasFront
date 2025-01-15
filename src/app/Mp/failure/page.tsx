import Link from "next/link";

export default function FailureMp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-custom-purple">
      <h1 className="text-4xl font-bold text-purple-dark mb-4">
        ¡Pago Fallido 😣!
      </h1>
      <p className="text-gray-800 mb-6">
        Hubo un problema con tu pago. Intenta nuevamente.
      </p>
      <Link href="/">
        <button className="px-4 py-2 bg-purple-dark text-white rounded border-2 ">
          Volver al inicio
        </button>
      </Link>
    </div>
  );
}