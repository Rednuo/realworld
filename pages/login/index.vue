<template>
  <div class="auth-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">{{isLogin?'登录':'注册'}}</h1>
        <p class="text-xs-center">
          <nuxt-link v-if="!isLogin" to="/login">已有账号，去登录</nuxt-link>
          <nuxt-link v-if="isLogin" to="/register">没账号，去注册</nuxt-link>
        </p>

        <ul class="error-messages">
          <template v-for="(messages,field) in errors">
            <li v-for="(message,index) in messages" :key="index">{{field}} {{message}}</li>
          </template>
          
        </ul>

        <form @submit.prevent="onSubmit">
          <fieldset class="form-group" v-if="!isLogin">
            <input class="form-control form-control-lg" type="text" v-model="user.username" placeholder="Your Name" required>
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="email" v-model="user.email" placeholder="Email" required>
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="password" v-model="user.password" placeholder="Password" required minlength="8">
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">
            {{isLogin?'登录':'注册'}}
          </button>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import {login,register} from '@/api/user.js'
const Cookie=process.client?require('js-cookie'):undefined
export default {
    middleware:'notAuthenticated',
    name:"LoginIndex",
    computed:{
        isLogin(){
            return this.$route.name==='login'
        }
    },
    data(){
      return {
        user:{
          username:'',
          email:'',
          password:''
        },
        errors:{}
      }
    },
    methods:{
      async onSubmit(){
        try{
          const {data}=this.isLogin?
          await login({
            user:this.user
          }):
          await register({
            user:this.user
          })

        console.log(data)
        //todo:保存用户的登录状态
        this.$store.commit('setUser',data.user)
        // 数据持久化
        Cookie.set('user',data.user)
        //跳转到首页
        this.$router.push('/')
        }catch(err){
          console.log('请求失败'+err)
          this.errors=err.response.data.errors
        }
      }
    }
}
</script>

<style>

</style>