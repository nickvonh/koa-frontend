<template>
    <div class="frames">
        <div class="hero" :style="{'background-image': `url(${hero})`}">
            <img :src="hero"/>
            <div class="blackout">
                <h1>{{copy}}</h1>
            </div>
        </div>
    </div>
</template>
<script>


export default {
  name : 'frames',
  props: ['hero', 'copy'],
  data () {
      return {
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
        background-repeat no-repeat
        background-size 100%
        img
            width 100%
            visibility hidden
    @media screen and (max-width 800px)
        img
            width 200%
            visibility hidden
        .hero
            height 100vh
            width 100%
            background-size cover
            background-position 50%
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
        background rgba(0,0,0,.1)
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
