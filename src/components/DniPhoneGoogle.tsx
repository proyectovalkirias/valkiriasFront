// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // Importar useRouter

// const DniPhoneGoogle: React.FC = () => {
//   const [formData, setFormData] = useState({
//     dni: "",
//     phone: "",
//   });

//   const [errors, setErrors] = useState({
//     dni: "",
//     phone: "",
//   });

//   const router = useRouter(); // Inicializar useRouter

//   // Esta función se ejecuta al cargar el componente
//   const fetchGoogleUserData = () => {
//     // Obtener el usuario desde localStorage
//     const userInfo = localStorage.getItem("user_info");
//     if (userInfo) {
//       const user = JSON.parse(userInfo);

//       // Comprobar si el usuario tiene access_token
//       if (!user.access_token) {
//         alert("El token de acceso de Google no está disponible.");
//         router.push("/login"); // Redirigir al login si el token no está presente
//         return;
//       }

//       // Comprobar si el usuario tiene DNI y teléfono
//       if (!user.dni || !user.phone) {
//         // Si no tiene los datos, rellenarlos en el formulario
//         setFormData({
//           dni: user.dni || "",
//           phone: user.phone || "",
//         });
//       } else {
//         // Si ya tiene DNI y teléfono, redirigir al inicio
//         router.push("/");
//       }
//     }
//   };

//   useEffect(() => {
//     fetchGoogleUserData();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     if (name === "dni" && !/^\d*$/.test(value)) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         dni: "El DNI debe contener solo números.",
//       }));
//       return;
//     }

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: "",
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const newErrors = {
//       dni: formData.dni.trim() === "" ? "El campo N° de DNI es obligatorio" : "",
//       phone: formData.phone.trim() === "" ? "El campo N° de Teléfono es obligatorio" : "",
//     };

//     setErrors(newErrors);

//     if (Object.values(newErrors).some((error) => error !== "")) {
//       return;
//     }

//     try {
//       // Obtener el usuario desde localStorage
//       const userInfo = localStorage.getItem("user_info");
//       if (userInfo) {
//         const user = JSON.parse(userInfo);
//         const updatedData = {
//           dni: parseInt(formData.dni, 10),
//           phone: formData.phone,
//         };

//         // Actualizar los datos en localStorage
//         const updatedUser = { ...user, dni: updatedData.dni, phone: updatedData.phone };
//         localStorage.setItem("user_info", JSON.stringify(updatedUser));

//         // Verificar si 'access_token' está presente antes de usarlo
//         const accessToken = user.access_token;

//         if (accessToken) {
//           // Aquí puedes realizar una solicitud con el access_token para interactuar con la API de Google o tu backend
//           console.log("Token de acceso de Google:", accessToken);

//           // Aquí deberías realizar una solicitud PUT o PATCH al backend o a la API de Google
//           // Si quieres actualizar datos en la API de Google, lo harías aquí

//           // Ejemplo para llamar a una API externa usando el access_token:
//           // const response = await fetch(`https://www.googleapis.com/userinfo/v2/me?access_token=${accessToken}`, {
//           //   method: 'GET',
//           //   headers: {
//           //     'Authorization': `Bearer ${accessToken}`,
//           //   },
//           // });
//           // const data = await response.json();
//           // console.log(data);

//           // Si estás interactuando con tu backend para actualizar los datos
//           // const updateResponse = await axios.put('/api/update-user', { dni: updatedData.dni, phone: updatedData.phone });

//           alert("¡DNI y Teléfono registrados correctamente!");
//           router.push("/"); // Redirigir a la página de inicio después de guardar
//         } else {
//           console.error("No se encontró el token de acceso de Google.");
//           alert("No se encontró el token de acceso de Google.");
//         }
//       }
//     } catch (error) {
//       console.error("Error al actualizar DNI y Teléfono:", error);
//       alert("Hubo un problema al guardar los datos. Intenta nuevamente.");
//     }
//   };

//   return (
//     <form className="flex flex-col" onSubmit={handleSubmit}>
//       <input
//         type="text"
//         name="dni"
//         placeholder="N° de DNI"
//         value={formData.dni}
//         onChange={handleChange}
//         className="mb-2 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
//       />
//       {errors.dni && <p className="text-red-500 text-sm">{errors.dni}</p>}
//       <input
//         type="text"
//         name="phone"
//         placeholder="N° de Teléfono"
//         value={formData.phone}
//         onChange={handleChange}
//         className="mb-2 border-b-2 border-white bg-transparent p-2 text-white outline-none w-full"
//       />
//       {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
//       <button
//         type="submit"
//         className="mb-4 rounded-md bg-purple-300 px-4 py-2 text-white hover:bg-purple-400 w-full"
//       >
//         Guardar
//       </button>
//     </form>
//   );
// };

// export default DniPhoneGoogle;
