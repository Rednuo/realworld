
/**
 * 基于 axios 封装的请求模块
 */
 import axios from 'axios'
 export const request =axios.create({
     baseURL:"https://conduit.productionready.io"
    //  baseURL:"http://realworld.api.fed.lagounews.com"
 })
//插件机制获取上下文对象(query、params、req、res、app、store...)
//插件导出的函数必须作为default成员
 export default({store})=>{
    //请求拦截器

    //任何请求都经过拦截器
    //请求器中做一些公共的业务处理，如统一设置token
    request.interceptors.request.use(function(config){
        const {user}=store.state
        if(user&&user.token){
            config.headers.Authorization=`Token ${user.token}`
        }
        return config
    },function(error){
        return Promise.reject(error)
    })
 }
 
 //响应拦截器