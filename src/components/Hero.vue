<template>
    <div class="frames">
            <!-- Copy and Image -->
            <div class="hero" v-lazy:background-image="hero">
                <div class="copy">
                    <h1>
                        KOA
                    </h1>
                    <h4>
                        modern activewear
                    </h4>
                </div>
            </div>
            <!-- SVG wave -->
            <svg v-if="isMobile" class="wave" :width="width" height="500px" :viewBox="`0 0 ${width} 175`" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g fill="#FFFFFF" stroke="none" stroke-width="1" fill-rule="evenodd">
                    <path :d="`M1.02408579,408.112037 C159.657746,421.339967 159.657746,327 ${width},327 L${width},502 L1.02408579,501.999091 C-0.341361929,502.114768 -0.341361929,470.819083 1.02408579,408.112037 Z`" id="Path-2"></path>
                </g>
            </svg>

            <svg v-if="!isMobile" class="wave" :width="width" height="600" :viewBox="`0 0 ${width} 600`" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g fill="#FFFFFF" stroke="none" stroke-width="1" fill-rule="evenodd">
                    <path :d="`M-0.393209113,940.098413 C713.211169,985.451317 713.211169,862 ${width},862 L${width},1262 L-0.393209113,1261.99688 C-6.53559696,1262.39349 -6.53559696,1155.094 -0.393209113,940.098413 Z`" id="Path-2"></path>
                </g>
            </svg>

            <h4 class="shop" @click="cta">shop now</h4>


    </div>
</template>
<script>

export default {
  name : 'frames',
  props: ['hero', 'copy', 'cta'],
  mounted(){
      window.addEventListener('resize', ()=>{
          this.width = window.outerWidth
          this.height = window.outerHeight * .3
      })
  },
  data () {
      return {
          width : window.outerWidth,
          height: window.outerHeight * .3
      }
  },
  computed:{
      isMobile(){
          return this.width < 800
      }
  }
}
</script>
<style lang="stylus" scoped>
.frames
    width 100%
    height 100vh
    position relative
    background #E4E5EB
    .hero
        height 100%
        display flex
        background-repeat no-repeat
        background-size contain
        background-position 75%
        animation-name slidein
        animation-duration 1.5s
        animation-fill-mode forwards
        .copy
            width 100%
            padding 10%
            display flex
            flex-direction column
            justify-content flex-start
            align-items flex-start
            color white
            text-align left
            h1
                font-size 6em
                font-weight 500
                margin 0
            h4
                font-size 3em
                margin 0
                font-weight 500
        @media screen and (max-width 800px)
            .copy
                justify-content flex-start
                //filter drop-shadow(1px 1px 15px rgba(0,0,0,.3))
                h1
                    font-size 3em
                    margin 0
                h4
                    font-size 1.5em
                    margin 0
                    font-weight 400
        img
            max-width 100%
            height 800px
    .wave
        position absolute
        bottom -2px
        left 0
        z-index 900
        g
            transform translateY(-70%)
        @media screen and (max-width 800px)
            g
                transform translateY(-80%)
    .shop
        font-size 2.5em
        font-weight 500
        position absolute
        bottom 10%
        right 5%
        width auto
        text-align right
        color #7f8af5
        cursor pointer
        margin 0
        z-index 901
    @media screen and (max-width 800px)
        .shop
            font-size 2em
            right 5%
        .hero
            background-position bottom
            background-size 110%
            animation-name slideinMob
            animation-duration 1s
            animation-fill-mode forwards
@media screen and (max-width 800px)
    .frames
        height 90vh
@keyframes slidein
    from
        background-position 90%
        opacity 0
    to
        background-position 75%
        opacity 1
@keyframes slideinMob
    from
        background-position-x 30px
        opacity 0
    to
        background-position-x 0
        opacity 1

</style>
