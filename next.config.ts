/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Variable pública
    JWT_KEY_SECRET: process.env.JWT_KEY_SECRET,          // Variable privada
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,                    // Variable privada
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,            // Variable privada
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI: process.env.REDIRECT_URI,              // Variable privada
    TOKEN_URL: process.env.TOKEN_URL,                    // Variable privada
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // Agrega el dominio aquí
  },
};

module.exports = nextConfig;