const URL_BACKEND = import.meta.env.VITE_URL_API;
import { createHeaders } from "../utils/utils";
import { jwtDecode } from "jwt-decode";

export const getProfile = async () => {
  const getAuthToken = () => localStorage.getItem("token");
  const token = getAuthToken();
  const id = jwtDecode(token).sub;
  try {
    const response = await fetch(
      `${URL_BACKEND}/Profile/${id}`,
      createHeaders()
    );
    if (!response.status === 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (data) => {
  const getAuthToken = () => localStorage.getItem("token");
  const token = getAuthToken();
  data.id = jwtDecode(token).sub;
  try {
    const response = await fetch(
      `${URL_BACKEND}/Profile/UpdateProfile/${data.id}`,
      createHeaders("PUT", data)
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Actualizar contraseña
export const updatePassword = async (data) => {
  const getAuthToken = () => localStorage.getItem("token");
  const token = getAuthToken();
  data.id = jwtDecode(token).sub;
  try {
    const response = await fetch(
      `${URL_BACKEND}/Profile/ChangePassword/${data.id}`,
      createHeaders("PUT", data)
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Subir archivo de foto
export const updateUploadFile = async (data) => {
  const getAuthToken = () => localStorage.getItem("token");
  const token = getAuthToken();
  data.id = jwtDecode(token).sub;
  try {
    const response = await fetch(
      `${URL_BACKEND}/Profile/uploadFile/${data.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// eliminar foto
export const deleteFile = async () => {
  const getAuthToken = () => localStorage.getItem("token");
  const token = getAuthToken();
  const id = jwtDecode(token).sub;
  try {
    const response = await fetch(
      `${URL_BACKEND}/Profile/RemoveFile/${id}`,
      createHeaders("DELETE")
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
