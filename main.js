// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store/'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import $ from 'jquery'
import ECharts from 'vue-echarts'
import axios from './http/index.js'
import lodash from 'lodash'
import { Base64 } from 'js-base64'

import 'xterm/dist/xterm.css'
import 'font-awesome/css/font-awesome.css'

Vue.use(ElementUI)
Vue.component('chart', ECharts)

router.beforeEach((to, from, next) => {
 if(to.meta.requireAuth) {    //如果下一个页面的requireAuth是true,则验证token是否存在
    if(sessionStorage.getItem("user_token")){
       next()
    }else{
     next({path: '/login'})  
    }
 }else{
    next()
 }
})
Vue.prototype.$http = axios
Vue.prototype._ = lodash
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  template: '<App/>',
  components: { App },
})

