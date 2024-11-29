"use client"
import React, { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Landing = () => {
const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // Envía el código al backend para validarlo
            axios.post('https://localhost:3000/google', { code })
                .then(response => {
                    console.log("Usuario autenticado:", response.data);

                    const { token } = response.data;
                    if(token) {
                        localStorage.setItem('token', token);
                        router.push('/Landing');
                    }else {
                        console.error('Token no recibido');
                        router.push('/Login');
                    }
                })
                .catch(error => {
                    console.error("Error al autenticar:", error);
                });
        } else {
            console.error('Codifo de autenticaión no encontrado');
            router.push('/Login');
        }
    }, [router]);

    return <div>Procesando inicio de sesión...</div>;
};

export default Landing;
