import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';

const GoogleAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchGoogleAuth = async () => {
      try {
        const { code } = router.query;
        if(!code) throw new Error('Authorization code is missing');

        const res = await axios.get(
          `https://localhost:3000/google/redirect?code=${code}`
        );
        
        // Aquí guardas el token JWT en el almacenamiento local o en cookies
        localStorage.setItem('token', res.data.token);
        
        // Redirigir a la página principal o dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Error during Google authentication', error);
        router.push('/Login')
      }
    };

    if(router.query.code){  
      fetchGoogleAuth();
    }
  }, [router]);

  return <p>Authenticating...</p>;
};

export default GoogleAuth;