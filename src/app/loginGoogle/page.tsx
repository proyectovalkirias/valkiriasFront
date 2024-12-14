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



        // cami este lo agregue yo (facu) lo necesito para el dashboard, aunque no me funciona todavia 

        // Hacer una solicitud para obtener los detalles del usuario, incluyendo foto de perfil
        const userRes = await axios.get('http://localhost:3000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Guardamos los datos del usuario (nombre, email, foto)
        const userData = {
          name: userRes.data.name,
          email: userRes.data.email,
          photoUrl: userRes.data.photoUrl, // Foto de perfil de Google
        };


        
        // Guardamos la información del usuario en el almacenamiento local
        localStorage.setItem('user', JSON.stringify(userData));

        // Guardamos el token
        localStorage.setItem('token', token);

        // Redirigir a dashboard o a la página principal
        router.push('/dashboard');
      } catch (error) {
        console.error('Error durante la autenticación con Google', error);
        router.push('/login');
      }
    };

    // Verificamos si el query tiene el parámetro `code` para empezar el proceso
    if (router.query.code) {
      console.log('Redirigiendo con el código:', router.query.code);
      fetchGoogleAuth();
    }
  }, [router.isReady, router.query.code]);

  // return <p>Authenticating...</p>;

  // const handleLogout = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if(!token){
  //       console.error('No token found');
  //       return;
  //     }

  //     await axios.post('http://localhost:3000/google/logout', { token });
  //     localStorage.removeItem('token');
  //     console.log('Logout successfull');
  //     router.push('/dashboard')
  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //   }
  // }
};

export default GoogleAuth;
