import Link from "next/link";

export default function SuccessMp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-custom-purple">
      <h1 className="text-4xl font-bold text-purple-dark mb-4">
        ¡Pago Exitoso! 😎👌
      </h1>
      <p className="text-gray-800 mb-6">
        Gracias por tu compra. Hemos recibido tu pago correctamente.
      </p>
      <Link href="/">
        <button className="px-4 py-2 bg-custom-orange text-white rounded border-2 border-valkyrie-purple hover:bg-green-700">
          Volver al inicio
        </button>
      </Link>
    </div>
  );
}
