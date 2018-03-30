# Vue token 登陆鉴权完整方案
## 一、路由拦截
目的：页面跳转时验证是否即将进入的页面需要登陆验证。

``` javascript
//router/index.js，给需要验证的页面添加 meta : {  requireAuth :true } 如下：
routes: [
    {
	    path: '',
        redirect: 'Login'
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
```
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

