import axios from 'axios';
import ElementUI from 'element-ui';

const service = axios.create({
    timeout: 3000
});

service.interceptors.response.use(
    response => {
        return response;
    }, error => {
        switch (error.response.status) {
            case 400:
                console.error(error)
                ElementUI.Message({
                    message: error.response.data.errorDescription,
                    type: 'error',
                    duration: 5000
                });
                break;
            case 401:
                ElementUI.Message({
                    message: '尚未登录',
                    type: 'error',
                    duration: 5000
                });
                window.location.href = '/#/login' //'https://console.wejuai.com'
                break;
            case 403:
                ElementUI.Message({
                    message: '没有权限',
                    type: 'error',
                    duration: 5000
                });
                break;
            case 404:
                ElementUI.Message({
                    message: '没有该路径',
                    type: 'error',
                    duration: 5000
                });
        }
        if (error.response.status >= 500) {
            ElementUI.Message({
                message: '服务器错误',
                type: 'error',
                duration: 5000
            });
        }
        return Promise.reject(error);
    }
);

export default service;
