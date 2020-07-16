import axios from 'axios';
import {Message} from "element-ui";
// import store from '../store/store';


const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/' : '';
const errorText = {
    400: '请求参数错误',
    405: '请求方式错误',
    500: '服务器错误',
    504: '服务器响应超时',
};
// axios.defaults.baseURL = '/api';
let request = axios.create({
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    timeout: 30000,
});
request.interceptors.request.use(
    config => {
        config.headers.token = localStorage.getItem('JANUS-TOKEN');
        config.withCredentials = true;
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);
request.interceptors.response.use(
    response => {
        //debugger
        if (response.headers['content-disposition']) return Promise.resolve(response.data);
        // 接口正常返回的情况
        if ('' + response.data.msgCode === '401') {
            window.location.href = '/#/login'
            return Promise.reject(response.data);
        } else if (response.data.code === '0') {
            // 其他系统接口正常返回的情况
            return Promise.resolve(response.data.data);
        } else if (response.data.code === 200) {
            // 流程中心系统正常返回的情况
            if (response.data.msgCode === '200') {
                return Promise.resolve(response.data.data);
            } else {
                Message(response.data.msgContent);
                return Promise.reject(response.data);
            }
        } else {
            Message(response.data.message);
            return Promise.reject(response.data);
        }
    },
    error => {
        // 接口报错的情况
        const errRes = error.response;
        if (errRes) {
            let resErrorText = errorText[errRes.status];
            if (resErrorText) {
                Message.error(resErrorText);
            } else {
                Message.error(errRes.status + '\n' + errRes.statusText);
            }
        } else {
            if (error.toString().indexOf('timeout') >= 0) {
                Message.error('接口超时');
            } else {
                console.error(error);
            }
        }
        return Promise.reject(error);
    },
);
export default request;