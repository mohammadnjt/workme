import axiosInstance from 'axios';


console.log('process.env.BASE_URL', process.env.BASE_URL)
console.log('process.env.NEXT_PUBLIC_BASE_URL', process.env.NEXT_PUBLIC_BASE_URL)
const useAxios = axiosInstance.create({
    baseURL: process.env.BASE_URL ||'http://192.168.20.65:3030/api/'
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