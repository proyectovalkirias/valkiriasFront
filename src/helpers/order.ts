import Swal from "sweetalert2";

const APIURL = process.env.NEXT_PUBLIC_API_URL

export const createOrder= async (products: number[], token: string) => {
    try {
        const response = await fetch(`${APIURL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
        },
        body: JSON.stringify({ products })
    });

    await Swal.fire({
        title: "Éxito!",
        icon: "success",
        text: "Compra exitosa",
    });

    return response.json()
    } catch (error: any){
        Swal.fire({
            title: "Ups!",
            icon: "error",
            text: "Error al crear la orden de compra"
        })
        throw new Error(error)
    }
}

export const getOrders =async (token: string) => {
    try {
        const response = await fetch(`${APIURL}/users/orders`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-type": "application/json",
                Authorization: token
            }
            });
            return response.json()
        } catch (error: any) {
            Swal.fire({
                title: "Ups!",
                icon: "error",
                text: "Error al obtener ordenes de compra"
            })
            throw new Error(error)
        }
}