import axiosInstance from 'axios';

const useAxios = axiosInstance.create({
    baseURL: process.env.BASE_URL ||'https://taskina.online:3031/api/'
});

useAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken'); // گرفتن توکن از لوکال استوریج
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default useAxios;