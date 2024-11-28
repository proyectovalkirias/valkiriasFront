import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

const withAuth = (WrappedComponent: React.ComponentType) => {
    return (props: any) => {
      const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/Login');
        return;
      }

      try {
        jwtDecode(token); // Verifica que el token sea válido
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/Login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;