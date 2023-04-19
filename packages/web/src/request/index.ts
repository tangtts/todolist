

import axios, { AxiosRequestConfig }  from "axios";
import {message} from "antd"
const AxiosInstance = axios.create({
  baseURL:"http://127.0.0.1:3000",
})

AxiosInstance.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`
  return config
})


AxiosInstance.interceptors.response.use((response)=>{
  return response;
},err=>{
  const errData = err.response.data;
  message.error(`${errData.statusCode}:${errData.message}`,
  );
})




export async function requset<T = any>(config:AxiosRequestConfig){
  return AxiosInstance.request<T>(config).then(res=>res.data)
}   