import axios from "axios";
import Setting from "@/setting";
const service = axios.create({
  baseURL: Setting.apiBaseURL,
  timeout: 30000, // 请求超时时间
});

axios.defaults.withCredentials = true; // 携带cookie

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    config.baseURL = Setting.apiBaseURL;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    let status = response.data ? response.status : 0;
    const code = status;
    if(status==200){
        return response.data;
    }else{
        Promise.reject(response.data)
    }
  },
  (error) => {
    return Promise.reject({errmsg:err.message})
  }
);

export default service;
