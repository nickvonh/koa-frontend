<template>
  <div class="home">
    <frames :hero="frames.andi" copy="Active Essentials"></frames>
    <div class="shout-box">
      <shoutout :image="frames.tageKick" headline="show us how you" :copy="`do you`" :clickFunction="goFabrics"></shoutout>
      <shoutout :image="frames.kikiFull" headline="" :copy="`the best you`" :clickFunction="goFabrics"></shoutout>
    </div>
    <frames :hero="frames.kiki" copy="Ready For Anything"></frames>
    <instagram></instagram>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Frames from './Frames.vue'
import Shoutout from './Shoutout.vue'
import Instagram from './Instagram.vue'
import andi from '@/assets/images/mock-photos/landing/andi.jpg'
import tage from '@/assets/images/mock-photos/landing/tage.jpg'
import tageKick from '@/assets/images/mock-photos/landing/tageKick.jpg'
import kiki from '@/assets/images/mock-photos/front.jpg'
import kikiFull from '@/assets/images/mock-photos/full.jpg'


export default {
  name: 'Home',
  components: {Frames, Shoutout, Instagram},
  data () {
    return {
      frames : {
        andi,
        tage,
        tageKick,
        kiki,
        kikiFull
      }
    }
  },
  methods : {
    shop(){
      this.$router.push({name:'Collection', params:{collection:'all'}})
    },
    goBrushed(){
      this.$router.push({name:'Group', params:{group:'brushed'}})
    },
    goScuba(){
      this.$router.push({name:'Group', params:{group:'scuba'}})
    },
    goBreezy(){
      this.$router.push({name:'Group', params:{group:'breezy'}})
    },
    goFabrics(){
      this.$router.push({name:'Fabrics'})
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
  background #f2f2f2
  display flex
  flex-direction column
  justify-content center
  align-items center
  margin 0 auto
  .shout-box
    display flex
    flex-flow row wrap
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
    font-weight 600
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
