export const formatDate = (date, format) => {
  let formated = format
  const year = date.getFullYear(),
    month = (date.getMonth() + 1).toString().padStart(2, '0'),
    day = date.getDate().toString().padStart(2, '0'),
    hours = date.getHours().toString().padStart(2, '0'),
    minutes = date.getMinutes().toString().padStart(2, '0'),
    seconds = date.getSeconds().toString().padStart(2, '0');


  formated = formated.replaceAll('YYYY', year);
  formated = formated.replaceAll('MM', month);
  formated = formated.replaceAll('DD', day);
  formated = formated.replaceAll('HH', hours);
  formated = formated.replaceAll('mm', minutes);
  formated = formated.replaceAll('ss', seconds);


  return formated
}

export const createHeaders=(method = 'GET', body,headers = {})=>{
  const getAuthToken = () => localStorage.getItem('token');
  const token = getAuthToken(); 
  const baseHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...headers
  };
  const config = {
    method,
    headers: baseHeaders,
  };

  if (method !== 'GET' && body) {
    config.body = JSON.stringify(body);
  }

  return config;
}
