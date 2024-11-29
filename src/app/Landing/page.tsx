import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';

const GoogleAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchGoogleAuth = async () => {

        const { code } = router.query;
    if (!code) return;
    
      try {
        // const { code } = router.query;
        // if(!code) throw new Error('Authorization code is missing');

        const res = await axios.post(
          'http://localhost:3000/google/redirect', { code }
        );
        
        const { token } = res.data;
        // Aquí guardas el token JWT en el almacenamiento local o en cookies
        localStorage.setItem('token', token);

        console.log('Token recibido:', token);
        
        
        // Redirigir a la página principal o dashboard
        console.log('Redirigiendo a /dashboard...');
        router.push('/dashboard');
      } catch (error) {
        console.error('Error during Google authentication', error);
        router.push('/Login')
      }
    };

    if(router.query.code){  
      fetchGoogleAuth();
    }
  }, [router.query.code]);

  return <p>Authenticating...</p>;
};

export default GoogleAuth;