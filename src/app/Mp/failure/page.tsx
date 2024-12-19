import Link from "next/link";

export default function FailureMp() {
    return (
        <div>
        <h1>¡Pago Fallido 😣!</h1>
        <p>Hubo un problema con tu pago. Intenta nuevamente</p>
        <Link href="/">
        <a> Volver al inicio</a>
        </Link>
     </div>
  );
}