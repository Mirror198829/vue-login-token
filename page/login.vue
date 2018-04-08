<template>
   <div id="login">
   	  <div id="login-header">
   	  	<div class="login-header-title clearfix">
   	  		<img src="../assets/cloud.png" height="45" width="45" style="position:relative;top:10px">
   	  		<span style="font-size:20px;font-weight:700;position:relative;top:-5px;left:2px">虎踞云</span>
   	  		<div style="float:right">
   	  			<router-link :to="{name: 'Home'}" style="margin-right:20px">首页</router-link>
   	  			<span>帮助中心</span>
   	  		</div>
   	  	</div>
   	  </div>
   	  <div id="login-main" class="clearfix">
   	  	  <div id='login-main-left' class="pull-left"></div>
	   	  <div id="loginform">  	      
	   	      	<ul class="clearfix" id="loginTabNav">
	   	      		<li class="pull-left loginTabItem" @click="changeTab(1)" :class="{'active':showBoxId==1}">手机号快捷登陆</li>
	   	      		<li class="pull-left loginTabItem" @click="changeTab(2)" :class="{'active':showBoxId==2}">账号密码登陆</li>
	   	      	</ul>
	   	      	<div class="form-content" v-show="showBoxId == 1">
	   	      		<el-form ref="form" :model="msgForm" id="msgForm">
	   	      		  <div class="errorMsg" v-show="msgForm.errorMsg">{{msgForm.errorMsg}}</div>
					  <el-form-item>
					    <el-input v-model="msgForm.phone"  placeholder="手机号" @focus="isMsgShow=false" @blur="verifyPhone()"></el-input>
					  </el-form-item>				  
					  <el-form-item>
					    <el-input v-model="msgForm.verificationMsg" placeholder="短信动态密码" style="width:60%"></el-input>
					    <el-button type="info"  id="sentMsgBtn" :disabled="isSend" @click="sendMsg()">{{btnTxt}}</el-button>
					  </el-form-item>
					  <el-form-item>
					    <el-button  size="large" type="primary"  style="width:100%;margin-top:20px;" @click="onSubmitByMsg()" :loading="isMsgLoading">登&nbsp&nbsp陆</el-button>
					  </el-form-item>
				    </el-form>
	   	      	</div>
	   	      	<div class="form-content"  v-show="showBoxId == 2" id="accountForm">
	   	      		<el-form ref="form" :model="accountForm">
		   	      	  <div class="errorMsg" v-show="accountForm.errorMsg">{{accountForm.errorMsg}}</div>
					  <el-form-item>
					    <el-input v-model="accountForm.name"  placeholder="用户名" @focus="isMsgShow=false"></el-input>
					  </el-form-item>
					  <el-form-item>
					    <el-input v-model="accountForm.password"  type="password" placeholder="密码" @focus="isMsgShow=false"></el-input>
					  </el-form-item>
					  <el-form-item class="clearfix">
					    <el-input v-model="accountForm.verification" style="width:50%;float:left"  placeholder="验证码" @focus="isMsgShow=false"></el-input>
					    <div id="verificateImg" :class="verificateImg"></div>
					    <div id="otherTxt" @click="changeVerifyImg()">换一张</div>
					  </el-form-item>
					  <el-form-item>
					    <el-button  size="large" type="primary"  style="width:100%;margin-top:20px;" @click="onSubmitByAccount()" :loading="isAccountLoading">登&nbsp&nbsp陆</el-button>
					  </el-form-item>				  
				    </el-form>
	   	      	</div>
	   	      	<p class="clearfix login-other">
				  	<a class="login-other-forgetpass">忘记密码</a> | 			  	
				  	<a class="login-other-register">免费注册</a>
				</p>   	      
	   	  </div>
   	  </div>
   </div>

</template>

<script>
  import store from '../store/'
  export default {
    data() {
      return {
        accountForm: {
          name: '',
          password:'',
          errorMsg:''
        },
        isMsgShow:false,
        btnTxt:'发送动态密码',
        msgSendSeconds:10,
        verificateImg:'verificateImg1',
        isSend:false,
        showBoxId:1,
        msgForm:{
          phone:'',
          verificationMsg:'',
          errorMsg:''
        },
        timer:null,
        isAccountLoading:false,
        isMsgLoading:false
      }
    },
    methods: {
      //账号提交
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
      },
      //发送验证码
      sendMsg(){
      	if(this.msgForm.phone == ""){
      		this.msgForm.errorMsg="请填写手机号"
      		return false
      	}
      	this.btnTxt='正在发送中'
      	this.isSend=true
      	setTimeout(()=>{
      		this.msgSendSeconds=10     		
      		this.btnTxt=this.msgSendSeconds+'s'
      		this.timer=setInterval(()=>{
      			if(this.msgSendSeconds == 1){
      				this.btnTxt='重新发送'
      				this.isSend=false
      				clearInterval(this.timer)
      			}else{
      				this.msgSendSeconds --
      				this.btnTxt = this.msgSendSeconds+'s'
      			}
      		},1000)
      	},2000)
      },
      //验证手机号
      verifyPhone(){
      	if(this.msgForm.phone == ""){
      		this.msgForm.errorMsg="请填写手机号"
      	}else{
      		this.msgForm.errorMsg=""
      	}
      },
      //换一张
      changeVerifyImg(){
      	if(this.verificateImg=="verificateImg1"){
      		this.verificateImg="verificateImg2"
      	}else{
      		this.verificateImg="verificateImg1"
      	}
      },
      //手机号输入提交
      onSubmitByMsg(){
      	if(this.msgForm.phone == ""){
      		this.msgForm.errorMsg="请填写手机号"
      	}else if(this.msgForm.verificationMsg==""){
      		this.msgForm.errorMsg="请填写短信动态码"
      	}else if(this.msgSendSeconds<=1){
      		this.msgForm.errorMsg="短信动态密码超时，请重新发送"
      	}else{
      		this.isMsgLoading=true
      		setTimeout(()=>{
      			this.$router.push({ name: 'Home'});
      		},1000)
      	}    	
      },
      //切换tab
      changeTab(id){
        this.accountForm={
          name: '',
          password:'',
          errorMsg:''
        }
        this.msgForm={
          phone:'',
          verificationMsg:'',
          errorMsg:''
        }
      	this.showBoxId=id
      }
    }
  }
</script>
<style>
	.el-form-item{position: relative;}

</style>
<style scoped>
#login{min-width: 1250px;}
.loginTabItem{cursor: pointer;width: calc(100% /2);text-align: center;box-sizing: border-box;font-size: 14px;color:#333;height:44px;line-height: 44px;position: relative;top:1px;}
.loginTabItem:hover{color:#20a0ff;}
.loginTabItem.active{border-bottom:2px solid #20a0ff;}
#loginform{width: 420px;box-sizing: border-box;padding:30px 42px;padding-bottom:30px;background-color: #fff;margin-top:80px;float: right;box-shadow:0 0 18px rgba(129,132,149,1)}
#verificateImg{width:80px;height:30px;background-repeat:no-repeat;background-position:  center center;background-size:90% 90%;float:left;margin-left:10px;border:1px solid #ccc;position:relative;top:3px;}
.verificateImg1{background-image: url('../assets/home/num1.jpg')}
.verificateImg2{background-image: url('../assets/home/num2.jpg')}

#otherTxt{float: left;color:#333;font-size: 13px;position: relative;left:10px;top:2px;cursor: pointer}
#otherTxt:hover{text-decoration: underline;}
#sentMsgBtn{position: absolute;right:0;top:1px;width:38%;}
#loginTabNav{margin-bottom:20px;border-bottom:1px solid #EEE}
#msgForm,#accountForm{padding-top:10px;}
.errorMsg{position: absolute;top:-13px;color:red;font-size:13px;}
.form-content{position: relative;}
.login-other{text-align: right;color:#777;font-size: 13px;position: relative;top:-10px;}
.login-other-register,.login-other-forgetpass{color:#777;font-size: 13px;cursor: pointer;}
.login-other-register:hover,.login-other-forgetpass:hover{text-decoration: underline;}
#login{background-color: #fff}
#login-main{width: 1200px;margin:0 auto;background:url('../assets/home/loginmain.png');background-position:90px 94px;height:680px;background-repeat: no-repeat;background-size: 36% 48%}
#login-main-left{}
#login-header{background-color:#333;height:66px;line-height:66px;}
.login-header-title{width: 1200px;margin:0 auto;color:#fff;}
</style>
