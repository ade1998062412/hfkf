import axios from 'axios';
import { Message } from 'element-ui';
import router from '@/router';

let messageInstance = null;

const resetMessage = (options) => {
    //关闭上一个弹窗，继续下一个弹窗
    if (messageInstance) {
        messageInstance.close();
    }
    messageInstance = Message(options);
};

// import Vue from 'vue';
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    baseURL: 'https://wschat.micome.vip/api',
    timeout: 30000
});

service.interceptors.request.use(
    (config) => {
        if (config.url !== '/support/auth/login') {
            config.headers.common['Authorization'] = 'Bearer' + localStorage.getItem('token');
        }
        if (config.url == '/support/file/upload') {
            config.headers['Content-Type'] = 'multipart/from-data';
        } else {
            config.headers.common['Accept'] = 'application/json, text/plain, */*';
        }
        return config;
    },
    (error) => {
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            if (!response.data.errno || response.data.errno == 0) {
                return response.data;
            } else if (response.data.errno == 401) {
                resetMessage({
                    message: response.data.errmsg,
                    type: 'error'
                });
                localStorage.clear();
                router.replace('/login');
            } else {
                resetMessage({
                    message: response.data.errmsg,
                    type: 'error'
                });
            }
        } else {
            Promise.reject();
        }
    },
    (error) => {
        return Promise.reject();
    }
);

export default service;
