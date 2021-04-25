import {request} from "@/plugins/request"
//用户登录
export const login =data=>{
    return request({
        method:'POST',
          url:'/api/users/login',
          data
    })
}

//用户注册
export const register =data=>{
    return request({
        method:'POST',
          url:'/api/users',
          data
    })
}
//用户信息更新
export const update =data=>{
    return request({
        method:'PUT',
          url:'/api/user',
          data
    })
}
//获取用户信息
export const getUser =()=>{
    return request({
        method:'GET',
          url:'/api/user',
    })
}