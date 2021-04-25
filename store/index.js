const cookieparser=process.server?require('cookieparser'):undefined
// 在服务器渲染期间运行的都是同一个实例
// 为了防止数据冲突，要把state定义成一个函数，返回数据对象
export const state =()=> {
    return {
        user:null
    }
}
export const mutations={
    setUser (state,data){
        state.user=data
    }
}
export const actions={
    //服务器渲染期间自动调用，初始化容器数据，传递数据给客户端使用
    nuxtServerInit ({ commit }, { req }) {
        let user=null
        if (req.headers.cookie) {
            // 把cookie字符串转化为js对象
          const parsed=cookieparser.parse(req.headers.cookie)
          try{
              user=JSON.parse(parsed.user)
          }catch(err){}
        }
        commit('setUser',user)
      }
}

