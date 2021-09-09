import $qs from 'qs';
import store from '@/store';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
const baseURL = process.env.VUE_APP_BASE_API;

const $axios = axios.create({
  baseURL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 5
});

$axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers.Accept = '*/*';
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  config.method === 'post'
    ? config.data = $qs.stringify({ ...config.data })
    : config.params = { ...config.data };
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`;
  }
  return config;
}, (error: AxiosError) => {
  Promise.reject(error);
});

$axios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status !== 200) {
      console.error('error');
    } else {
      return response.data;
    }
  },

  (error: AxiosError) => {
    return Promise.reject(error);
  });

export default $axios;
