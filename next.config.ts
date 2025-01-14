import { NextConfig } from "next"; // Importa el tipo de Next.js
import dotenv from "dotenv"; // Importa dotenv para cargar variables de entorno

dotenv.config(); // Carga las variables de entorno

const nextConfig: NextConfig = {
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL, // Variable pública
    REACT_APP_JWT_KEY_SECRET: process.env.REACT_APP_JWT_KEY_SECRET, // Variable privada
    REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID, // Variable pública
    REACT_APP_GOOGLE_CLIENT_SECRET: process.env.REACT_APP_GOOGLE_CLIENT_SECRET, // Variable privada
    REACT_APP_GOOGLE_REDIRECT_URI:
      process.env.REACT_APP_GOOGLE_REDIRECT_URI, // Variable pública
      REACT_APP_TOKEN_URL: process.env.REACT_APP_TOKEN_URL, // Variable privada
  },
  images: {
    domains: ["res.cloudinary.com"], // Agrega el dominio aquí
  },
  eslint: {
    ignoreDuringBuilds: true, // Opcional, para evitar que el build falle por errores de ESLint
  },
};

export default nextConfig; // Exporta la configuración
