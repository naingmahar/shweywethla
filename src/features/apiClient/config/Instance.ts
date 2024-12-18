import axios from 'axios';
import { STORAGE_KEY, Storage } from '../../storage/localstorage';

export const instance = axios.create({
    baseURL: "http://192.168.1.103:3000/",
    timeout: 10000,
});


// Add a request interceptor
instance.interceptors.request.use(function (config) {
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
    console.log("ERROR",error)
    if(error.response.data) error.message = error.response.data.message
    
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