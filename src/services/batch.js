const URL_BACKEND = import.meta.env.VITE_URL_API;
import {createHeaders} from '../utils/utils'

export const getBatchsByProduct = async (productId, pageNumber, pageSize ) => {
  try{
    const response = await fetch(`${URL_BACKEND}/Batch/Batches_x_product/${productId}?PageNumber=${pageNumber}&PageSize=${pageSize}`, createHeaders());
  if (!response.status===200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
  }catch(e){
    throw e;
  }
}

export const createBatch = async (data) => {
 try{
  const response = await fetch(`${URL_BACKEND}/Batch`,createHeaders('POST',data))
  if (response.status===500) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
 }catch(e){
  throw e;
 }
}

export const updateBatch = async (data) => {
  try{
    const response = await fetch(`${URL_BACKEND}/Batch/${data.id}`,createHeaders('PUT',data))
  if (response.status===500) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
  }catch(e){
    throw e;
  }
}

export const deleteBatch = async (id) => {
try{
  const response= await fetch(`${URL_BACKEND}/Batch/${id}`,createHeaders('DELETE'))
  if (response.status===500) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}catch(e){
  throw e;
}
}