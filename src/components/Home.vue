<template>
  <div class="home">
    <hero :hero="frames.heroImage" :cta="shop"></hero>
    <!-- <quote :background="frames.tage" copy="stylish gear that fits into your life"></quote> -->
    <div class="shout-box">
      <h2>check out our collections</h2>
      <div class="shouts">
        <shoutout :image="frames.midi" :cta="`tops`" :clickFunction="goTops" color="ash"></shoutout>
        <shoutout :image="frames.leggings" :cta="`bottoms`" :clickFunction="goBottoms" color="cream"></shoutout>
        <shoutout :image="frames.shells" :cta="`shells`" :clickFunction="goOuter" color="mint"></shoutout>
      </div>
    </div>
    <flexible :hero="frames.flexImg" :cta="goAbout"></flexible>
    <instagram/>
  </div>
</template>



<script>
import gql from 'graphql-tag'
import Hero from './Hero.vue'
import Quote from './Quote.vue'
import Shoutout from './Shoutout.vue'
import Instagram from './Instagram.vue'
import Flexible from './Flexible.vue'
import heroImage from '../assets/images/mock-photos/hero.png'
import flexImg from '@/assets/images/mock-photos/flexible.png'
import shells from '@/assets/images/mock-photos/landing/shells.png'
import midi from '@/assets/images/mock-photos/landing/midi.png'
import leggings from '@/assets/images/mock-photos/landing/leggings.png'


export default {
  name: 'Home',
  components: {Hero, Shoutout, Quote, Instagram, Flexible},
  data () {
    return {
      frames : {
        heroImage,
        flexImg,
        shells,
        midi,
        leggings
      },
      rotate : 0
    }
  },
  methods : {
    shop(){
      this.$router.push({name:'Collection', params:{collection:'all'}})
    },
    goTops(){
      this.$router.push({name:'Collection', params:{collection:'tops'}})
    },
    goOuter(){
      this.$router.push({name:'Collection', params:{collection:'outer-layers'}})
    },
    goBottoms(){
      this.$router.push({name:'Collection', params:{collection:'bottoms'}})
    },
    goFabrics(){
      this.$router.push({name:'Fabrics'})
    },
    goAbout(){
      this.$router.push({name:'About'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
@keyframes shop
  0%
    background-position 0% 99%
  50% 
    background-position 100% 2%
  100% 
    background-position 0% 99%
.home
  display flex
  flex-direction column
  justify-content center
  align-items center
  margin 0 auto
  .shout-box
    width 100%
    text-align left
    padding-left 5%
    min-height 60vh
    color #666666
    box-sizing border-box
    h2
      font-size 3em
      font-weight 500
      margin-bottom 10%
    .shouts
      display flex
      justify-content space-between
      width 100%
      height 80vh
    @media screen and (max-width 800px)
      h2
        font-size 1.75em
        font-weight 500
      .shouts
        display flex
        justify-content flex-start
        overflow-x scroll
  .VueCarousel
    width 100%
  .VueCarousel-pagination
    background white
.block
  display flex
  align-items center
  justify-content flex-start
  flex-direction column
  max-width 100%
  background white
  h3
    margin 10px
    font-size 1.5em
    font-weight 500
  img
    width 65%
  .hero
    max-width 50%
  .copy
    background white
    width 100%
    text-align center
    font-size 1em
</style>
