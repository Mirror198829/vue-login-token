import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'
//国总
//axios.defaults.baseURL='http://172.32.149.43:8083/nlsysmgr/v1/'
//api网关
axios.defaults.baseURL='http://172.32.149.51:8000/sysmgr/nlsysmgr/v1/'
axios.interceptors.request.use(
	config => {
	    if (sessionStorage.getItem("user_token")) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
	        config.headers.Authorization = 'Bearer '+ sessionStorage.getItem("user_token")
	    }
	    return config
	},
	err => {
	    return Promise.reject(err)
})
axios.interceptors.response.use(
  response => {
    return response
  },
  error => { //默认除了2XX之外的都是错误的，就会走这里
    if(error.response){
      switch(error.response.status){
        case 401:
          Message.error({
             message: 'Token失效，请重新登陆'
          })
          sessionStorage.removeItem('user_token') //可能是token过期，清除它
          router.replace({ //跳转到登录页面
            path: '/Login'
          })
          break;
        case 404:
          router.replace({ //跳转到登录页面
            path: '/404'
          })
          break;
        case 500:
         Message.error({
             message: '服务器错误'
         })
         break;
      }
    }else{
      router.replace({ //跳转到登录页面
        path: '/404'
      })
    }
    return Promise.reject(error.response)
})
export default axios