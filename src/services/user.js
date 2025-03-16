const URL_BACKEND = import.meta.env.VITE_URL_API;
import {createHeaders} from '../utils/utils'

export const getUsers = async () => {
  try {
    const response = await fetch(`${URL_BACKEND}/User`, createHeaders());
    if (!response.status===200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error; 
  }
}

export const searchUsersByName = async (value) => {
  try {
    const response = await fetch(`${URL_BACKEND}/User/Search/v${value}`, createHeaders());
    if (!response.status===200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const createUser = async (data ) => {
  try {
    const response = await fetch(`${URL_BACKEND}/User`, createHeaders('POST',data));

    if (response.status===500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const updateUser = async (data) => {
  try {
    const response = await fetch(`${URL_BACKEND}/User/${data.id}`, createHeaders('PUT',data));
    if (response.status===500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${URL_BACKEND}/User/${id}`, createHeaders('DELETE'));
    if (response.status===500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}