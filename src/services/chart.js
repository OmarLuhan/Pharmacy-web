const URL_BACKEND = import.meta.env.VITE_URL_API;
import { createHeaders } from "../utils/utils";

export const getDataBarChart = async () => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Charts/BarChart`,
      createHeaders()
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
};

export const getDataLineChart = async () => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Charts/LineChart`,
      createHeaders()
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
};

export const getDataFrequencyGraph = async () => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Charts/FrequencyGraph`,
      createHeaders()
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
};

export const getDataProductsZeroGraph = async () => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Charts/ProductsZero`,
      createHeaders()
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
};

export const getDataDistribucionVentasGraph = async () => {
  try {
    const response = await fetch(
      `${URL_BACKEND}/Charts/DistributionGraph`,
      createHeaders()
    );
    if (response.status === 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
};
