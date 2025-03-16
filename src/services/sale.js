const URL_BACKEND = import.meta.env.VITE_URL_API;
import { createHeaders } from "../utils/utils";
import { jwtDecode } from "jwt-decode";
export const getSaleHistory = async (params) => {
  const searchParams = new URLSearchParams(params).toString();
  try {
    const response = await fetch(
      `${URL_BACKEND}/Sale/SaleHistory?${searchParams}`,
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
export const searchSaleHistory = async (value) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Sale/Search?value=${value}`,
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
export const createSale = async (data) => {
  try {
    const getAuthToken = () => localStorage.getItem("token");
    const token = getAuthToken();
    data.usuarioId = jwtDecode(token).sub;
    const response = await fetch(
      `${URL_BACKEND}/Sale`,
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

export const cancelSale = async (id) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Sale/Cancel/${id}`,
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

export const getSale = async (correlativo) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Sale/${correlativo}`,
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
