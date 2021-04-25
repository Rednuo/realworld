<template>
  <div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">设置</h1>
        <form @submit.prevent="onSubmit">
          <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" v-model="userInfo.image" placeholder="头像链接">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" v-model="userInfo.username" placeholder="名字">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" rows="8" v-model="userInfo.bio" placeholder="简介"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" v-model="userInfo.email" placeholder="邮箱">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" v-model="userInfo.password" placeholder="新密码">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                更新
              </button>
          </fieldset>
        </form>
        <hr>
        <button class="btn btn-outline-danger" @click="logout()">
          点击退出
        </button>

      </div>

    </div>
  </div>
</div>
</template>

<script>
import {update,getUser} from '@/api/user.js'
const Cookie=process.client?require('js-cookie'):undefined
export default {
  middleware:'authenticated',
  name:'SettingIndex',
  async asyncData({query,store}){
      const {data} =await getUser()
      const {user}=data
      console.log(user)
      return {
        user
      }
    },
  data(){
      return {
        userInfo:{
          bio:'',
          email:'',
          image:'',
          password:''
        },
        errors:{}
      }
    },
    mounted(){
      this.userInfo=this.user
    },
  methods:{
    async oldUser(){
      const {data}=await getUser()
      console.log(data)
    },
    async onSubmit(){
        try{
          const {data}=await update({
            user:this.userInfo
          })
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
    },
    logout(){
      Cookie.remove('user')
      this.$store.commit('setUser',null)
      this.$router.push('login')
    }
  }
}
</script>

<style>

</style>