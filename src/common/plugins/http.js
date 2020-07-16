'use strict';
import axios from 'axios';
import ES6Promise from 'es6-promise';
// import appRouters from '../routers/router.index.js'
ES6Promise.polyfill(); // [ext] fix ie9 promise bug

axios.defaults.withCredentials = true;

axios.defaults.headers.token = localStorage.getItem('JANUS-TOKEN');

// [ext] axios request interceptors
axios.interceptors.request.use(config => {
  // config.headers['X-Requested-With'] = 'XMLHttpRequest'
  config.headers.token = localStorage.getItem('JANUS-TOKEN');
  return config;
});


// [ext] axios response interceptors
axios.interceptors.response.use(
  result => {
    console.log(result);
    const { data } = result;
    if (data.msgCode === '401') {
      // 身份验证失败
      window.open = window.location.origin + '/login'
      return;
    }

    if (
      (data.msgCode !== undefined && data.msgCode != '200') ||
      (data.code != '0' && data.message !== undefined)
    ) {
      return Promise.reject({ ...data, cancelDefaultExceptionPrecess });
    }
    return data.data;
  },
  err => {
    if (err.message && err.message.indexOf('Network Error') > -1) {
      // appRouters.replace({
      //   path: '/401'
      // })
      return Promise.reject(err);
    }
  }
);

const http = {};
http.timeout = 60000; // 60s 1min

http.get = function(url, params) {
  let config = {
    method: 'GET',
    url: url,
    params: params, // params : { key : value}
    timeout: this.timeout,
    headers: {
      'Content-Type': 'application/xxxx-form; charset=UTF-8',
    },
    responseType: 'json',
  };
  return axios(config);
};

http.post = function(url, obj) {
  let config = {
    method: 'POST',
    url: url,
    data: JSON.stringify(obj), // change obj to json obj
    timeout: this.timeout,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    responseType: 'json',
  };
  return axios(config);
};

http.downLoad = function(url, params, fileName) {
  let config = {
    method: 'POST',
    url: url,
    params: params, // params : { key : value}
    timeout: this.timeout,
    headers: {
      'Content-Type': 'application/xxxx-form; charset=UTF-8',
    },
    responseType: 'blob',
  };
  return axios(config);
};

export default http;
