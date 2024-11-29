"use client"
import React, { useEffect } from 'react';
import axios from 'axios';

const Landing = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // Envía el código al backend para validarlo
            axios.post('http://localhost:3000/google', { code })
                .then(response => {
                    console.log("Usuario autenticado:", response.data);
                })
                .catch(error => {
                    console.error("Error al autenticar:", error);
                });
        }
    }, []);

    return <div>Procesando inicio de sesión...</div>;
};

export default Landing;
