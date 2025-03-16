const URL_BACKEND = import.meta.env.VITE_URL_API;
import { createHeaders } from "../utils/utils";
export const getProducts = async (pageNumber, pageSize) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Product/paginated?PageNumber=${pageNumber}&PageSize=${pageSize}`,
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

export const searchProductsByName = async (value) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Product/Search/${value}`,
      createHeaders()
    );
    if (!response.status === 200)
      throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getProductForSale = async (value) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Product/product_for_sale/${value}`,
      createHeaders()
    );
    if (!response.status === 200)
      throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getProductForGrn = async (value) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Product/product_for_grn/${value}`,
      createHeaders()
    );
    if (!response.status === 200)
      throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getProductForGrnName = async (value) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Product/product_for_grn_name/${value}`,
      createHeaders()
    );
    if (!response.status === 200)
      throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getProductForSaleName = async (value) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Product/product_for_sale_name/${value}`,
      createHeaders()
    );
    if (!response.status === 200)
      throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getProductDownload = async () => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Product/Download`,
      createHeaders()
    );
    if (!response.status === 200)
      throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (data) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Product`,
      createHeaders("POST", data)
    );
    if (response.status === 500)
      throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (data) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Product/${data.id}`,
      createHeaders("PUT", data)
    );
    if (response.status === 500)
      throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Product/${id}`,
      createHeaders("DELETE")
    );
    if (response.status === 500)
      throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};
