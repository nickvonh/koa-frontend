<template>
  <div class="home">
    <frames></frames>
    <div class="shoutout">
      <h3>Details are in the...</h3>
      <p>
          Style – Comfort – Function<br>
          They all start with the perfect fabric.<br>
      </p>
      <router-link to="/fabrics"><button class="cta">learn more</button></router-link>
    </div>
    <carousel :perPage="perPage"
    paginationActiveColor="#2c3e50"
    :loop="true">
      <slide class="block">
        <div @click="goBrushed">
          <h3>Softest. Leggings. Ever.</h3>
          <img :src="brush"/>
          <div class="copy">
            <h4>See our incredibly soft brushed fleece</h4>
          </div>
        </div>
      </slide>
      <slide class="block">
        <div @click="goScuba">
          <h3>Light Weight Insulate</h3>
          <img :src="scuba"/>
          <div class="copy">
            <h4>Check out our cool scuba collection</h4>
          </div>
        </div>
      </slide>
      <slide class="block">
        <div @click="goBreezy">
          <h3>Breeze With Ease</h3>
          <img :src="perf"/>
          <div class="copy">
            <h4>Ventilate in style with this group</h4>
          </div>
        </div>
      </slide>
    </carousel>
    <instagram></instagram>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Frames from './Frames.vue'
import {Carousel, Slide} from 'vue-carousel'
import squatJump from '@/assets/squat_jump.gif'
import brush from '@/assets/images/mauve_front.jpg'
import perf from '@/assets/images/teal_closeup.jpg'
import scuba from '@/assets/images/concrete_crop.jpg'
import reversible from '@/assets/images/reversible_lite.jpg'
import Instagram from './Instagram.vue'

export default {
  name: 'Home',
  components: {Frames, Carousel, Slide, Instagram},
  data () {
    function perPage(){
      if(window.innerWidth < 800){
        return 1
      }else{
        return 3
      }
    }
    return {
      brush: brush,
      perf: perf,
      scuba: scuba,
      squatJump : squatJump,
      play : false,
      reversible : reversible,
      perPage : perPage()
    }
  },
  watch : {
    play(nu, old){
      if(!!nu){
        document.querySelector('.hero').play()
      }else{
        document.querySelector('.hero').pause()
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
  .shoutout
    text-align center
    padding 8%
    font-size 1em
    font-weight 500
    h3
      margin-top 0
    .cta
      font-size .85em
      font-weight 600
      background #56a79f
      width 35%
      max-width 200px
      height 40px
      border none
      border-radius 2px
      color white
      cursor pointer
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
