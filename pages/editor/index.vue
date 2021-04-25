<template>
  <div class="editor-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-10 offset-md-1 col-xs-12">
        <form >
          <fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control form-control-lg" v-model="newArticle.title" placeholder="文章标题" required>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" v-model="newArticle.description" placeholder="关于？" required>
            </fieldset>
            <fieldset class="form-group">
                <textarea class="form-control" rows="8" v-model="newArticle.body" placeholder="开始创作 (in markdown)" required></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="输入标签" v-model="newArticle.tagList[0]" required>
                <!-- <div class="tag-list" v-for="(item,index) in article.tagList" :key="index">{{item}}</div> -->
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="onSubmit">
                发布文章
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {createArticle,getArticle,getArticles,updateArticle} from '@/api/article.js'
import {mapState} from 'vuex'
export default {
  // 路由匹配之前先执行中间件处理
    middleware:'authenticated',
    name:"EditorIndex",
    async asyncData({query,store}){
      const slug=query.slug
      if(slug){
        const {data} =await getArticle(slug)
        const {article}=data
        console.log(article)
        return {
          article
        }
      }
    },
    data(){
        return {
            newArticle:{
              title: "",
              description: "",
              body: "",
              tagList: []
            }
        }
    },
    computed:{
      ...mapState(['user'])
    },
    mounted(){
      if(this.article){
        this.newArticle=this.article
      }
    },
    methods:{
      async onSubmit(){
        if(this.article){
          console.log(1)
            try{
              const newArticleSlug=this.article.slug
              const dd=await updateArticle(newArticleSlug,{
                article:this.newArticle
              })
              console.log(dd)
            //跳转到首页
            this.$router.push(`/article/${newArticleSlug}`)
            }catch(err){
              console.log('请求失败'+err)
            }
        }else{
          console.log(2)
            try{
              await createArticle({
                article:this.newArticle
              })
              const myArticleRes=await getArticles({
                  author:this.user.username
              })
              const newArticleSlug=myArticleRes.data.articles[0].slug
              console.log(newArticleSlug)
            //跳转到首页
            this.$router.push(`/article/${newArticleSlug}`)
            }catch(err){
              console.log('请求失败'+err)
            }
        }
        
      }
    }
}
</script>

<style>

</style>