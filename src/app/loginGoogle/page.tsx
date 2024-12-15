import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';

const GoogleAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchGoogleAuth = async () => {
      try {
        const { code } = router.query;
        console.log('Query params:', router.query);

        if (!code) throw new Error('Authorization code is missing');

        // Intercambiar el código por un token en tu servidor
        const res = await axios.post(
          'http://localhost:3000/google/redirect',
          { code }
        );

        const { token } = res.data;
        console.log('Token recibido', token);

        // Guardamos el token
        localStorage.setItem('token', token);

        // Obtener información del usuario desde Google API
        const userInfo = await axios.get(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
        );

        const { given_name, family_name, email, picture } = userInfo.data;

        // Guardamos la información del usuario en localStorage
        localStorage.setItem(
          'user',
          JSON.stringify({
            firstname: given_name,
            lastname: family_name,
            email,
            photo: picture,
          })
        );

        // Redirigir a Dashboard o a la página principal
        router.push('/Dashboard');
      } catch (error) {
        console.error('Error durante la autenticación con Google', error);
        router.push('/Login');
      }
    };

    // Verificamos si el query tiene el parámetro `code` para empezar el proceso
    if (router.query.code) {
      console.log('Redirigiendo con el código:', router.query.code);
      fetchGoogleAuth();
    }
  }, [router.isReady, router.query.code]);

  return <p>Authenticating...</p>;
};

export default GoogleAuth;
