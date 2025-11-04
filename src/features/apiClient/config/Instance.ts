import axios from 'axios';
import { STORAGE_KEY, Storage } from '../../storage/localstorage';

export const instance = axios.create({
    baseURL: "https://d17qwwj2uuuc4d.cloudfront.net/",
    // baseURL: "http://192.168.1.129:3000/",
    timeout: 10000,
});

export const setHeaderWithToken = (token: string | null) => {
  if (token) {
    instance.defaults.headers.common.Authorization = "Bearer " + token;
  } else {
    instance.defaults.headers.common.Authorization = null;
  }
};



// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // console.log(config)
    // let token =  Storage.getItem(STORAGE_KEY.token)
    // config.headers["Authorization"] = `Bearer ${token}`
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    if(response.data) return response.data;
    return response;
  }, function (error) {
    if(error.response.data) error.message = error.response.data.message
    if(error.response) console.log("ERROR Auto",error.response)
    return Promise.reject(error);
  });


export const storageInstance = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 10000,
});


// Add a request interceptor
storageInstance.interceptors.request.use(function (config) {
  let token =  Storage.getItem(STORAGE_KEY.token)
  config.headers["Authorization"] = `Bearer ${token}`
  return config;
}, function (error) {
  return Promise.reject(error);
});