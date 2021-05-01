<template>
  <div class="profile-page">
  <div class="user-info">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="user.image" class="user-img" v-if="user.image" />
          <h4>{{user.username}}</h4>
          <p>{{user.bio}}</p>
          <nuxt-link class="btn btn-sm btn-outline-secondary action-btn" :to="{name:'settings'}">
            <i class="ion-gear-a"></i>
            &nbsp;
            修改设置
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <nuxt-link class="nav-link" :class="{active:tab==='my_feed'}" exact :to="{name:'profile',params:{username:user.username},query:{tab:'my_feed'}}">我的文章</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" :class="{active:tab==='fav_feed'}" exact :to="{name:'profile',params:{username:user.username},query:{tab:'fav_feed'}}">喜欢的文章</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="article-preview" v-for="article in articles" :key="article.slug">
          <div class="article-meta">
            <nuxt-link :to="{name:'profile',params:{username:article.author.username}}"><img :src="article.author.image" /></nuxt-link>
            <div class="info">
              <a href="" class="author">{{article.author.username}}</a>
              <span class="date">{{article.createdAt | date('MMM DD,YYYY')}}</span>
            </div>
            <button class="btn btn-outline-primary btn-sm pull-xs-right" @click="onFavorite(article)" :disabled="article.favoriteDisabled">
              <i class="ion-heart"></i> {{article.favoritesCount}}
            </button>
          </div>
          <nuxt-link :to="{name:'article',params:{slug:article.slug}}" class="preview-link">
            <h1>{{article.title}}</h1>
            <p>{{article.description}}</p>
            <span>详情wq...</span>
            <ul class="tag-list">
              <li class="tag-default tag-pill tag-outline" v-for="(tag,index) in article.tagList" :key="index">{{tag}}</li>
            </ul>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import {getArticles,addFavorite,deleteFavorite} from '@/api/article.js'

import {mapState} from 'vuex'
export default {
  middleware:'authenticated',
  name:"UserProfile",
  
  async asyncData({query,store}){
      const page=Number.parseInt(query.page||1)
      const limit=20
      const {tag}=query
      const tab=query.tab||'my_feed'

      const myArticleRes=await getArticles({
          limit,
          offset:(page-1)*limit,
          tag:query.tag,
          author:store.state.user.username
      })
      const favArticleRes=await getArticles({
          limit,
          offset:(page-1)*limit,
          tag:query.tag,
          favorited:store.state.user.username
      })
      const {articles,articlesCount}=tab==='fav_feed'?favArticleRes.data:myArticleRes.data
      articles.forEach(article=>article.favoriteDisabled=false)
      
      return {
        articles,
        articlesCount,
        limit,
        page,
        tag,
        tab:query.tab||'my_feed'
      }
  },
  watchQuery:['page','tag','tab'],
  computed:{
    ...mapState(['user']),
    totalPage(){
      return Math.ceil(this.articlesCount/this.limit)
    }
  },
  methods:{
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
      }
    }
}
</script>

<style>

</style>