const VITE_QUERY_DNI = import.meta.env.VITE_QUERY_DNI;
const VITE_QUERY_RUC = import.meta.env.VITE_QUERY_RUC;
const VITE_AUTH_DNI_AND_RUC = import.meta.env.VITE_AUTH_DNI_AND_RUC;

export const searchDni = async (dni) => {
  try {
    const response = await fetch(VITE_QUERY_DNI, {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
        Authorization: `Bearer ${VITE_AUTH_DNI_AND_RUC}`,
      },
      body: JSON.stringify(dni),
      redirect: "manual",
    });
    if (response.status === 500) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const searchRuc = async (ruc) => {
  try {
    const response = await fetch(VITE_QUERY_RUC, {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
        Authorization: `Bearer ${VITE_AUTH_DNI_AND_RUC}`,
      },
      body: JSON.stringify(ruc),
      redirect: "manual",
    });
    if (response.status === 500) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
