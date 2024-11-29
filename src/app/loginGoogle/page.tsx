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

        if(!code) throw new Error('Authorization code is missing');

        const res = await axios.post(
          'http://localhost:3000/google/redirect', { code }
        );
        const { token } = res.data;
        console.log('Token recibido', token);
        
        // Aquí guardas el token JWT en el almacenamiento local o en cookies
        localStorage.setItem('token', token);
        
        // Redirigir a la página principal o dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Error during Google authentication', error);
        router.push('/Login')
      }
    };

    if(router.query.code){ 
      console.log('Redirigiendo con el código:', router.query.code); 
      fetchGoogleAuth();
    }
  }, [router.isReady, router.query.code]);

  return <p>Authenticating...</p>;
};

export default GoogleAuth;