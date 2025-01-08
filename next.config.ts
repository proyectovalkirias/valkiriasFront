/** @type {import('next').NextConfig} */
require("dotenv").config(); // Asegúrate de cargar dotenv aquí

const nextConfig = {
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
};

module.exports = nextConfig;
