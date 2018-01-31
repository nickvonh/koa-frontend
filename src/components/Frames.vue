<template>
    <div class="frames">
        <div class="hero">
            <img :src="hero"/>
            <div class="blackout">
                <h1>Active Every Day</h1>
                <button @click="shop" class="cta">shop</button>
            </div>
        </div>
    </div>
</template>
<script>
import one from '@/assets/step/frame1.png'
import two from '@/assets/step/frame2.png'
import three from '@/assets/step/frame3.png'
import hero from '@/assets/images/hero.jpg'

export default {
  name : 'frames',
  mounted(){
    let that = this
    let key = 0;
    let limit = this.frames.length - 1
    let direction = 1

    setInterval(()=>{
        if(key < limit){
            key = key + 1
        }else{
            key = 0
        }
        that.key = key
    },1200)
  },
  data () {
      return {
          frames : [
              one,
              two,
              three,
              two
          ],
          hero : hero,
          key : 1
      }
  },
  methods : {
    shop(){
      this.$router.push({name:'Collection', params:{collection:'all'}})
    }
  },
  computed : {
      activeFrame (){
          return this.frames[this.key]
      }
  }
}
</script>
<style lang="stylus">
.frames
    width 100%
    position relative
    .hero
        max-height 90vh
        width 100%
        background-image url('../assets/images/hero.jpg')
        background-repeat no-repeat
        background-size 100%
        img
            width 100%
            visibility hidden
    @media screen and (max-width 800px)
        img
            display none
        .hero
            height 75vh
            width 100%
            background-size 250%
            background-position 35% -10%
    .blackout
        display flex
        flex-direction column
        justify-content center
        align-items center
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background rgba(0,0,0,.2)
        h1
            color white
            font-size 2em
        .cta
            font-size 1em
            font-weight 600
            background #56a79f
            width 35%
            max-width 200px
            height 40px
            border none
            border-radius 2px
            color white
            cursor pointer
            margin 30px 0
    span
        font-weight 900
        font-size 1.3em
        text-align left
</style>
