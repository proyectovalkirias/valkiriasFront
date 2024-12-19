import Link from "next/link";

export default function SuccessMp() {
    return (
        <div>
        <h1>¡Pago Exitoso 😎👌!</h1>
        <p>Gracias por tu compra. Hemos recibido tu pago correctamente.</p>
        <Link href="/">
        <a> Volver al inicio</a>
        </Link>
     </div>
  );
}