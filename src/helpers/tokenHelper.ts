// helpers/tokenHelper.ts

// Obtener el token desde localStorage
export const getToken = (): string | null => {
    try {
      const token = localStorage.getItem("token");
      return token ? `Bearer ${token}` : null;
    } catch (error) {
      console.error("Error al obtener el token:", error);
      return null;
    }
  };
  
  // Configurar los headers con el token
  export const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: token } : {};
  };
  
  // Guardar un token en localStorage
  export const setToken = (token: string): void => {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error al guardar el token:", error);
    }
  };
  
  // Eliminar el token de localStorage
  export const removeToken = (): void => {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error al eliminar el token:", error);
    }
  };
  