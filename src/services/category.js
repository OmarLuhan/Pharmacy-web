const URL_BACKEND = import.meta.env.VITE_URL_API;
import {createHeaders} from '../utils/utils'

export const getCategories = async (pageNumber, pageSize) => {
  try{
    const response = await fetch(`${URL_BACKEND}/Category/paginated?PageNumber=${pageNumber}&PageSize=${pageSize}`, createHeaders());
  if (!response.status===200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
  }catch(error){
    throw error; 
  }
}

export const getAllCategories = async () => {
  try{
    const response = await fetch(`${URL_BACKEND}/Category`, createHeaders());
  if (!response.status===200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
  }catch(error){
    throw error;
  }
}

export const searchCategoriesByName = async (value) => {
  try{
    const response = await fetch(`${URL_BACKEND}/Category/Search/${value}`,createHeaders());
  if (!response.status===200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
  }catch(error){
    throw error;
  }
}

export const createCategory = async (data) => {
  try{
    const response = await fetch(`${URL_BACKEND}/Category`,createHeaders('POST',data));
  if (response.status===500) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
  }catch(error){
    throw error;
  }
}

export const updateCategory = async (data) => {
  try{
    const response = await fetch(`${URL_BACKEND}/Category/${data.id}`,createHeaders('PUT',data))
  if (response.status===500) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
  }catch(error){
    throw error;
  }
}

export const deleteCategory = async (id) => {
  try{
    const response = await fetch(`${URL_BACKEND}/Category/${id}`,createHeaders('DELETE'));
  if (response.status===500) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
  }catch(error){
    throw error;
  }
}
