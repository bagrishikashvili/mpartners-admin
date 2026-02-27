import axios from "axios";
import { getToken, getRefreshToken, deleteToken, saveStorageObject } from "lib/storage";
const token = getToken();

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_AUTH_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
});
let locale = localStorage.getItem('@lang');


const updateAxiosHeaders = (newLocale: any) => {
  locale = newLocale;
  axiosInstance.defaults.headers['Accept-Language'] = newLocale;
  axiosInstance.defaults.headers['Authorization'] = token;
};

//Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      window.location.reload();
    } else {
      return Promise.reject(error);
    }
  }
);

export { axiosInstance, updateAxiosHeaders };
