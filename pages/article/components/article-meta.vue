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
          <button class="btn btn-sm btn-outline-secondary" :class="{active:article.author.following}" @click="onFollow(profile)" :disabled="profile.followDisabled">
            <i class="ion-plus-round"></i>
            &nbsp;
            {{profile.following?'取消关注':'关注'}} {{article.author.username}}
          </button>
          &nbsp;
          <button class="btn btn-sm btn-outline-primary" :class="{active:article.favorited}" @click="onFavorite(article)" :disabled="article.favoriteDisabled">
            <i class="ion-heart"></i>
            &nbsp;
            喜欢 <span class="counter">({{article.favoritesCount}})</span>
          </button>
        </template>
        
      </div>
</template>

<script>
import {deleteArticle,addFavorite,deleteFavorite} from '@/api/article.js'
import {addFollow,deleteFollow} from '@/api/user.js'
import {mapState} from 'vuex'
export default {
    name:'ArticleMeta',
    props:{
        article:{
            type:Object,
            required:true
        },
        profile:{
          type:Object,
          required:true
        }
    },
    data(){
        return {
            isLoading:false,
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
      async onFavorite(article){
        article.favoriteDisabled=true
        if(article.favorited){
          await deleteFavorite(article.slug)
          article.favorited=false
          article.favoritesCount+=-1
        }else{
          await addFavorite(article.slug)
          article.favorited=true
          article.favoritesCount+=1
        }
        article.favoriteDisabled=false
      },
      async onFollow(profile){
        profile.followDisabled=true
        if(profile.following){
          const profile=await deleteFollow(this.article.author.username)
          console.log(profile)
          profile.following=false
        }else{
          const profile=await addFollow(this.article.author.username)
          console.log(profile)
          profile.following=true
        }
        profile.followDisabled=false
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