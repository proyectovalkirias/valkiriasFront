import Image from "next/image";

const Login: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-[#7b548b]">
      <div className="flex w-3/4 max-w-4xl rounded-lg bg-[#7b548b]">
        <div className="w-1/2 p-8 flex flex-col items-center justify-center text-center text-white">
          <Image
            src="/images/valkiriaslogo.jpg"
            alt="Valkirias Logo"
            width={150}
            height={150}
            className="mb-6"
          />
          <h2 className="text-2xl font-bold">¡Hola de nuevo!</h2>
          <p className="mt-4">
            ¿Tenés un diseño especial en mente? ¡Es el momento perfecto para
            hacer tu pedido!
          </p>
        </div>

        <div className="w-1/2 p-8 bg-[#7b548b]">
          <h2 className="mb-6 text-3xl font-bold text-white">Iniciar sesión</h2>
          <form className="flex flex-col">
            <input
              id="username"
              type="text"
              placeholder="Ingrese su usuario"
              className="mb-4 border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />

            <input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              className="mb-6 border-b-2 border-white bg-transparent p-2 text-white outline-none"
            />

            <button
              type="submit"
              className="rounded-md bg-creativity-purple px-4 py-2 text-white "
            >
              Iniciar sesión
            </button>
          </form>
          <p className="mt-4 text-sm text-white">
            ¿No tenés cuenta?{" "}
            <a
              href="/register"
              className="font-medium text-purple-300 hover:underline"
            >
              Registrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
