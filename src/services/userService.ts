
export const getUserData = async (token: string) => {
    try {
      const response = await fetch("http://localhost:3000/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener los datos del usuario.");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error en getUserData:", error);
      throw error;
    }
  };
  