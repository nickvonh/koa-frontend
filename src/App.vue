<template>
  <div id="app">
    <nav class="bottom-bar">
      <router-link to="/">
        <svg @click="()=>{}" class="logo" v-html="logo"/>
      </router-link>
    </nav>  
    <nav-menu :collections="collections"></nav-menu>
    
    <cart></cart>
    <router-view :collections="collections" :class="{view : true, padTop : !isHome}"/>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import queries from './resources/query'
import Cart from './components/Cart'
import MessageBar from './components/MessageBar'
import NavMenu from './components/NavMenu'
import Subscribe from './components/Subscribe'
import SiteFooter from './components/SiteFooter'
import MobNav from './components/MobNav'
import logo from './assets/logo.svg'

export default {
  name: 'app',
  components: {Cart, NavMenu, MessageBar, Subscribe, SiteFooter, MobNav},
  apollo: {
    shop : {
      query: gql(queries.rootQuery),
      update: (shop => shop.shop)
    }
  },
  computed:{
    collections(){
      if(!!this.shop){
        return this.shop.collections.edges.filter(c => c.node.title !== 'giveaway').map(c => c.node)
      }
    },
    isHome() {
      if(this.$route.name !== 'Home'){
        return false
      }else{
        return true
      }
    },
    isProduct() {
      if(!!/Product/.test(this.$route.name)){
        return true
      }else{
        return false
      }
    }
  },
  data () {
    return {
      activeCollection : null,
      shop : null,
      notTop: false,
      logo: logo
    }
  },
  mounted(){
    const that = this;

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    let ID;

    if(!/localhost/.test(window.location.href)){
      ID = '485996101782581'
    }else{
      ID = '261819907649252'
    }
    
    this.$analytics.fbq.init(ID)
    this.$analytics.fbq.event('PageView')


    window.onscroll = ()=>{
      this.notTop = window.scrollY !== 0 && this.$route.name !== 'Product-Color'
    }
  }
}
</script>

<style lang="stylus">
hr
  border none
  border-top 1px solid #53577c74
body
  margin 0
#app 
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
.view.padTop
  margin-top 0
.header
  background #f2f2f2
  padding 30px 0px
  transition .3s ease
  &.shrink
    padding 0
    display flex
    flex-direction column
    align-items center
    justify-content flex-start
    .links
      padding 0
      margin 0 10px
    .tagLine
      display none



h1, h2 
  font-weight normal
ul
  list-style-type none
  padding 0
li 
  display inline-block
  margin 0 10px
a 
  color #42b983
.footer
  padding 5px
  background #f2f2f2
  a
    color lighten(#53577c, 50%)
  img.social
    height 20px
.bottom-bar
  position fixed
  bottom 0
  left 0
  width 100%
  height 3.5rem
  background rgb(255,255,255)
  z-index 1000
  display flex
  align-items center
  justify-content center
  .logo
      padding 10px 0
      height 15px
      width auto
      max-width 100px
img[lazy]
  transition .3s transform opacity

img[lazy="loading"]
  opacity 0
  transform translateX(10%)

img[lazy="loaded"]
  opacity 1
  transform translateX(0)


</style>
