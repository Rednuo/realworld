<template>
  <div>
      <form class="card comment-form">
        <div class="card-block">
          <textarea class="form-control" placeholder="Write a comment..." rows="3" v-model="comment.body"></textarea>
        </div>
        <div class="card-footer">
          <img :src="user.image" class="comment-author-img" v-if="user.image"/>
          <span class="btn btn-sm btn-primary" type="submit" @click="onSubmit(article)">提交评论</span>
        </div>
      </form>
      <div class="card" v-for="comment in comments" :key="comment.id">
        <div class="card-block">
          <p class="card-text">{{comment.body}}</p>
        </div>
        <div class="card-footer">
          <nuxt-link class="comment-author" :to="{name:'profile',params:{username:comment.author.username}}">
            <img :src="comment.author.image" class="comment-author-img"/>
          </nuxt-link>
          &nbsp;
          <nuxt-link class="comment-author" :to="{name:'profile',params:{username:comment.author.username}}">{{comment.author.username}}</nuxt-link>
          <span class="date-posted">{{comment.createdAt | date('MMM DD, YYYY')}}</span>
          <span class="mod-options">
            <i class="ion-trash-a"></i>
          </span>
        </div>
      </div>
  </div>
</template>

<script>
import {getComments,addComments} from '@/api/article.js'
import {mapState} from 'vuex'
export default {
    name:'ArticleComment',
    props:{
        article:{
          type:Object,
          require:true
        }
    },
    data(){
        return {
            comments:[],
            comment:{
              "body":''
            }
        }
    },
    async mounted(){
        const {data}=await getComments(this.article.slug)
        this.comments=data.comments
    },
    computed:{
      ...mapState(['user']),
    },
    methods:{
      async onSubmit(article){
        if(!!this.comment.body){
            await addComments(article.slug,{
              comment:this.comment
            })
            this.comment.body=''
            const {data}=await getComments(this.article.slug)
            this.comments=data.comments
        }
      }
    }
}
</script>

<style>

</style>