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
        
        const res = await axios.post(
          'http://localhost:3000/google/redirect', 
          { code }
        );


        const { token, user } = res.data;
        console.log('Token recibido', token);
        console.log('Usuario recibido:', user);



        // cami este lo agregue yo (facu) lo necesito para el dashboard, aunque no me funciona todavia 

        // Hacer una solicitud para obtener los detalles del usuario, incluyendo foto de perfil
        const userRes = await axios.get('http://localhost:3000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = {
          name: userRes.data.name,
          email: userRes.data.email,
          photoUrl: userRes.data.photoUrl,
        };

        
        // Guardamos la información del usuario
        localStorage.setItem('user', JSON.stringify(userData));

        // Guardamos el token
        localStorage.setItem('token', token);

        router.push('/dashboard');
      } catch (error) {
        console.error('Error durante la autenticación con Google', error);
        router.push('/login');
      }
    };

    if (router.query.code) {
      console.log('Redirigiendo con el código:', router.query.code);
      fetchGoogleAuth();
    }
  }, [router.isReady, router.query.code]);
  
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if(!token){
        console.error('No token found');
        return;
      }
      
      await axios.post('http://localhost:3000/google/logout', { token });
      localStorage.removeItem('token');
      console.log('Logout successfull');
      router.push('/dashboard')
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
    <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default GoogleAuth;
