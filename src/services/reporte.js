const URL_BACKEND = import.meta.env.VITE_URL_API;
import { createHeaders } from "../utils/utils";

//Sales
export const getReportSales = async (params) => {
  try {
    const searchParams = new URLSearchParams(params).toString();
    const response = await fetch(
      `${URL_BACKEND}/Report/sales?${searchParams}`,
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

export const getReportSalesDownload = async (params) => {
  try {
    const searchParams = new URLSearchParams(params).toString();
    const response = await fetch(
      `${URL_BACKEND}/Report/sales/download?${searchParams}`,
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

//Entries
export const getReportEntriesDownload = async (params) => {
  try {
    const searchParams = new URLSearchParams(params).toString();
    const response = await fetch(
      `${URL_BACKEND}/Report/entries/download?${searchParams}`,
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

export const getReportGrn = async (params) => {
  try {
    const searchParams = new URLSearchParams(params).toString();
    const response = await fetch(
      `${URL_BACKEND}/Report/grn?${searchParams}`,
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
