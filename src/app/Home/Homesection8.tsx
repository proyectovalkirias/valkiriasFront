"use client";
import React from "react";
import Image from "next/image";

const HomeSection8: React.FC = () => {
  // Función para hacer scroll hacia la sección 1
  const scrollToHomeSection1 = () => {
    const homeSection1 = document.getElementById("Homesection1");
    if (homeSection1) {
      homeSection1.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section
        className="h-screen w-screen bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: "url('/images/love.jpg')" }}
      >
        {/* Logo Valkirias */}
        <button
          className="absolute top-6 left-6 md:top-8 md:left-8 p-2 bg-opacity-50 rounded-md"
          onClick={scrollToHomeSection1}
          aria-label="Ir al inicio"
        >
          <Image
            src="/images/valkiriaslogo.jpg"
            alt="Logo Valkirias"
            width={150}
            height={80}
            priority
          />
        </button>
      </section>
      <footer className="bg-[#7b548b] h-12  text-white py-6">
        <div className="container mx-auto flex items-center justify-between px-4 h-full">
          {/* Sección de Copyright */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Valkirias. Todos los derechos
              reservados.
            </p>
          </div>

          {/* Sección de Redes Sociales */}
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.324 0 2.463.099 2.795.143v3.24l-1.918.001c-1.505 0-1.797.715-1.797 1.763v2.311h3.586l-.467 3.622h-3.119V24h6.116c.73 0 1.324-.593 1.324-1.324V1.324C24 .593 23.407 0 22.676 0z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.342 3.608 1.317.975.975 1.255 2.242 1.317 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.342 2.633-1.317 3.608-.975.975-2.242 1.255-3.608 1.317-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.342-3.608-1.317-.975-.975-1.255-2.242-1.317-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.342-2.633 1.317-3.608.975-.975 2.242-1.255 3.608-1.317 1.266-.058 1.646-.07 4.85-.07m0-2.163C8.735 0 8.332.014 7.052.072 5.773.13 4.548.434 3.573 1.408 2.598 2.383 2.294 3.608 2.236 4.887.013 7.053 0 8.333 0 12s.013 4.947.072 7.113c.058 1.279.362 2.504 1.337 3.479.975.975 2.2 1.279 3.479 1.337 2.166.059 3.446.072 7.112.072s4.947-.013 7.113-.072c1.279-.058 2.504-.362 3.479-1.337.975-.975 1.279-2.2 1.337-3.479.059-2.166.072-3.446.072-7.112s-.013-4.947-.072-7.113c-.058-1.279-.362-2.504-1.337-3.479C19.452.434 18.227.13 16.948.072 15.668.014 15.265 0 12 0zm0 5.838c-3.403 0-6.162 2.758-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.758 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.324c-2.293 0-4.162-1.869-4.162-4.162s1.869-4.162 4.162-4.162 4.162 1.869 4.162 4.162-1.869 4.162-4.162 4.162zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M24 4.557a9.93 9.93 0 0 1-2.827.775 4.932 4.932 0 0 0 2.165-2.724 9.865 9.865 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482c-4.083-.205-7.699-2.159-10.126-5.134a4.822 4.822 0 0 0-.665 2.475c0 1.708.87 3.213 2.188 4.099a4.903 4.903 0 0 1-2.224-.616v.061a4.915 4.915 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.925 4.925 0 0 0 4.604 3.417A9.864 9.864 0 0 1 0 19.54a13.978 13.978 0 0 0 7.548 2.212c9.057 0 14.009-7.514 14.009-14.009 0-.213-.005-.426-.015-.637A10.025 10.025 0 0 0 24 4.557z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomeSection8;
