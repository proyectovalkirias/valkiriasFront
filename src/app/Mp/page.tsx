import { useState } from "react";

export default function CheckoutMp() {
const [isLoading, setIsLoading] =useState(false);

const products = []

const handlePayment = async () => {
    setIsLoading(true);

    try {
        const response = await fetch('https://localhost:3000/payment/create', {
            method: 'POST',
        });

        if(!response) {
           throw new Error('Failed to create payment preference');
        }

        const data = await response.json();
        const { url } = data;

        window.location.href = url;
     } catch (error) {
        console.error(error)
   } finally {
    setIsLoading(false);
   }
 };
}

