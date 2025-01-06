// import * as jwt_decode from 'jwt-decode';

// export async function getUserData(token: string) {
//   try {
//     // Decodificar el token JWT
//     const decodedToken: { email?: string } = jwt_decode(token); // Especificar el tipo para evitar el uso de 'any'
//     const email = decodedToken?.email;

//     if (!email) throw new Error('El token no contiene el email del usuario');

//     // Usar el email para consultar los datos completos del usuario desde el back-end
//     const response = await fetch(`https://tuservidor.com/api/users/email/${email}`, {
//       headers: {
//         Authorization: `Bearer ${token}`, // Enviar el token en la cabecera de autorización
//       },
//     });

//     if (!response.ok) throw new Error('Error al obtener la información del usuario');

//     const userData = await response.json();
//     return userData;
//   } catch (error) {
//     console.error('Error obteniendo los datos del usuario:', error);
//     return null;
//   }
// }
