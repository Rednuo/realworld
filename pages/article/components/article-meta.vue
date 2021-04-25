<template>
    <div class="article-meta">
        <nuxt-link :to="{name:'profile',params:{username:article.author.username}}"><img :src="article.author.image" /></nuxt-link>
        <div class="info">
        <nuxt-link :to="{name:'profile',params:{username:article.author.username}}" class="author">{{article.author.username}}</nuxt-link>
          <span class="date">{{article.updatedAt | date('MMM DD, YYYY')}}</span>
        </div>
        <template v-if="user.username===article.author.username">
          <button class="btn btn-sm btn-outline-secondary" :class="{active:article.author.following}" @click="goEditor">
            <i class="ion-edit"></i>
            &nbsp;
            编辑
          </button>
          &nbsp;
          <button class="btn btn-sm btn-outline-primary" :class="{active:article.author.favorited}" @click="goDelete" :disabled="isLoading">
            <i class="ion-trash-a"></i>
            &nbsp;
            删除
          </button>
        </template>
        <template v-else>
          <button class="btn btn-sm btn-outline-secondary" :class="{active:article.author.following}">
            <i class="ion-plus-round"></i>
            &nbsp;
            关注 {{article.author.username}} <span class="counter">(10)</span>
          </button>
          &nbsp;
          <button class="btn btn-sm btn-outline-primary" :class="{active:article.author.favorited}">
            <i class="ion-heart"></i>
            &nbsp;
            喜欢 <span class="counter">({{article.favoritesCount}})</span>
          </button>
        </template>
        
      </div>
</template>

<script>
import {deleteArticle} from '@/api/article.js'
import {mapState} from 'vuex'
export default {
    name:'ArticleMeta',
    props:{
        article:{
            type:Object,
            required:true
        }
    },
    data(){
        return {
            isLoading:false
        }
    },
    computed:{
      ...mapState(['user']),
    },
    methods:{
      async goEditor(){
        const slug=this.article.slug
        this.$router.push(`/editor?slug=${slug}`)
      },
      async goDelete(){
        const slug=this.article.slug
        this.isLoading=true
        await deleteArticle(slug)
        this.$router.push('/')
        this.isLoading=false
      }
    }
}
</script>

<style>

</style>