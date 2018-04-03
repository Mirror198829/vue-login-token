# Vue token 登陆鉴权完整方案
## 一、路由拦截
目的：页面跳转时验证，确认是否即将进入的页面需要登陆验证。
router/index.js
``` javascript
//给需要验证的页面添加 meta : {  requireAuth :true } 如下：
export default new Router({
  scrollBehavior (to, from, savedPosition) {          
    return { x: 0, y: 0 }
  }, 
  routes: [
    {
	    path: '*',
        redirect: '404'
    },
    {
        path: '',
        redirect: 'login'
    },
    {
        path:'/404',
        name:'NotFound',
        component:NotFound
    },

    {
        path:'/login',
        name:'Login',
        component:Login,
        meta : {
            requireAuth :false
        }
    },
    {
        path:'/main',
        name:'Main',
        component:Main,
        meta : { requireAuth :true },
        children:[
           {
                path:'/home',
                name:'Home',
                component: Home,
                meta : {  requireAuth :true }
           }
            ]
          }
        ]
    }
  ]
})
```
main.js
``` javascript
router.beforeEach((to, from, next) => {
 if(to.meta.requireAuth) {    //如果下一个页面的requireAuth是true,则验证token是否存在
  	if(sessionStorage.getItem("user_token")){
  	   next()
  	}else{
	   next({
	  	path: '/login',
    	query: {redirect: to.fullPath}
	  })	
  	}
 }else{
  	next()
 }
})
```
## 二、axios通信验证
目的：浏览器发送请求时，验证是否有token，是否需要登陆获取token；接收请求时，拦截，如果token过期则重新登陆。
#### 发送拦截
``` javascript
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
```
### 响应拦截
``` javascript
axios.interceptors.response.use(
  response => {
    return response
  },
  error => { //默认除了2XX之外的都是错误的，就会走这里
    if(error.response){
      switch(error.response.status){
        case 401:
          sessionStorage.removeItem('user_token') //可能是token过期，清除它
          router.replace({ //跳转到登录页面
            path: 'login',
            query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
    }
    return Promise.reject(error.response)
})
```
## 三.登陆获取token
``` javascript
onSubmitByAccount() {
	if(this.accountForm.name=='' || this.accountForm.password == ''){
		this.accountForm.errorMsg="用户名或密码不得为空"
	}else{
	  this.$http.post('tokens',{
	    username:this.accountForm.name,
	    password:this.accountForm.password
	  }).then(response=>{
	    sessionStorage.setItem("user_token",response.data) //保存token
	    if(this.$route.query.redirect){ 
	      let path = this.$route.query.redirect
	      this.$router.push({ path: path })
	    }else{
	      this.$router.push({name:'Home'})
	    }
	  }).catch(error=>{
	    this.accountForm.errorMsg="登陆失败！"
	  }) 
		//this.isAccountLoading =true;	
	}
	return false;
}
```

