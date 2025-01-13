import { NextConfig } from "next"; // Importa el tipo de Next.js
import dotenv from "dotenv"; // Importa dotenv para cargar variables de entorno

dotenv.config(); // Carga las variables de entorno

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Variable pública
    JWT_KEY_SECRET: process.env.JWT_KEY_SECRET, // Variable privada
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // Variable pública
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET, // Variable privada
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI:
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI, // Variable pública
    TOKEN_URL: process.env.TOKEN_URL, // Variable privada
  },
  images: {
    domains: ["res.cloudinary.com"], // Agrega el dominio aquí
  },
  eslint: {
    ignoreDuringBuilds: true, // Opcional, para evitar que el build falle por errores de ESLint
  },
};

export default nextConfig; // Exporta la configuración
