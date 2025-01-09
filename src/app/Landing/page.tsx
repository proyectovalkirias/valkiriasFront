"use client"
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';

const GoogleAuth = () => {

  if (typeof window === 'undefined') {
    return null; 
  }
  const router = useRouter();


  useEffect(() => {
    if (!router.isReady) return;
    const fetchGoogleAuth = async () => {
      const { code } = router.query;

      if (!code) return; // Si no hay código, no hacer nada.

      try {
        // Realizar la solicitud al backend para obtener el token con el código de autorización
        const res = await axios.post(
          'https://valkiriasback.onrender.com/google/redirect', { code }
        );

        const { token } = res.data;

        // Guardar el token JWT en el almacenamiento local
        localStorage.setItem('token', token);

        console.log('Token recibido:', token);

        // Redirigir a la página principal o dashboard
        console.log('Redirigiendo a /dashboard...');
        router.push('/dashboard');
      } catch (error) {
        console.error('Error during Google authentication', error);
        router.push('/Login'); // En caso de error, redirigir al login
      }
    };

    // Solo ejecutar la autenticación si code está disponible en la query.
    if (router.query.code) {
      fetchGoogleAuth();
    }
  }, [router.isReady, router.query.code]); // Dependencia solo en router.query.code

  return <p>Authenticating...</p>;
};

export default GoogleAuth;