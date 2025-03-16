const URL_BACKEND = import.meta.env.VITE_URL_API;
import { createHeaders } from "../utils/utils";
// Función para iniciar sesión
export const authOneUser = async (data) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Auth/login`,
      createHeaders("POST", data)
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Función para recuperar la contraseña
export const recoverPassword = async (email) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Auth/recover`,
      createHeaders("POST", { email }, { Accept: "text/plain" })
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const refreshAuthToken = async () => {
  const expiredToken = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("tokenRefresh");
  if (!expiredToken || !refreshToken) {
    throw new Error("No se encontraron tokens de autenticación");
  }
  try {
    const response = await fetch(
      `${URL_BACKEND}/Auth/loginRefresh`,
      createHeaders("POST", { expiredToken, refreshToken })
    );

    const { status, token, tokenRefresh } = response.data;
    if (status !== 200) throw new Error("no se puede obtener un nuevo token");

    localStorage.setItem("token", token);
    localStorage.setItem("tokenRefresh", tokenRefresh);
    return true;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenRefresh");
    throw error;
  }
};
