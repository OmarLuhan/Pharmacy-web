const URL_BACKEND = import.meta.env.VITE_URL_API;
import { createHeaders } from "../utils/utils";
import { jwtDecode } from "jwt-decode";

export const getGrnHistory = async (params) => {
  const searchParams = new URLSearchParams(params).toString();
  try {
    const response = await fetch(
      `${URL_BACKEND}/GoodsReceived/GrnHistory?${searchParams}`,
      createHeaders()
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const searchEntryHistory = async (value) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/GoodsReceived/Search?value=${value}`,
      createHeaders()
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const saveGoodsReceived = async (data) => {
  try {
    const getAuthToken = () => localStorage.getItem("token");
    const token = getAuthToken();
    data.usuarioId = jwtDecode(token).sub;
    const response = await fetch(
      `${URL_BACKEND}/GoodsReceived`,
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

export const getEntry = async (correlativo) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/GoodsReceived/${correlativo}`,
      createHeaders()
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const reverseEntry = async (id) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/GoodsReceived/Reverse/${id}`,
      createHeaders("PUT", id)
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
