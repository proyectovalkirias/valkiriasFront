import Link from "next/link";

export default function PendingMp() {
    return (
        <div>
        <h1>Pago en proceso ⏳</h1>
        <p>Estamos verificando tu pago.</p>
        <Link href="/">
        <a> Volver al inicio</a>
        </Link>
     </div>
  );
}