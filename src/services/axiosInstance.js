// import axiosInstance from 'axios';

// const axios = axiosInstance.create({
//   baseURL:
//     import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:9090/api',
// });

// // interceptor برای افزودن توکن به هدرهای هر درخواست
// axios.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('accessToken'); // گرفتن توکن از لوکال استوریج
//     if (token) {
//       config.headers['x-auth-token'] = token;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

// export default axios;

// services/axiosInstance.js
import axiosInstance from 'axios';
import { useAppStore } from "../stores/useAppStore";



const axios = axiosInstance.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:9000/api",
  withCredentials: true, // ارسال و دریافت کوکی‌ها
});

axios.interceptors.response.use(
  res => {
    // if(res.config.url === '/auth/login'){
    //   useAppStore.setState.setAuth(res.data.data.user);
    //   // window.location.href = '/app';
    // }
    // const token = localStorage.getItem('accessToken'); // گرفتن توکن از لوکال استوریج
    // if (token) {
    //   config.headers['x-auth-token'] = token;
    // }
    return res;
  },
  error => {
    if (error.response?.status === 401) {
      useAppStore.getState().clearAuth();

      console.warn('Unauthorized! Redirecting to login...');
      // window.location.href = '/auth/login';
    }

    // if (error.response?.status === 403) {
    //   console.warn('Unauthorized! Redirecting to login...');
    //   window.location.href = '/auth/noAccess';
    // }

    return Promise.reject(error);
  },
);

export default axios;