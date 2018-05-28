<template>
    <div class="shoutout">
      <img v-lazy="image"/>
      <div class="copy">
        <h3>{{headline}}</h3>
        <h3 v-html="copy"></h3>
        <button @click="clickFunction" class="cta">learn more</button>
    </div>
      
    </div>
</template>
<script>


export default {
  name : 'shoutout',
  props: ['headline', 'copy', 'image', 'clickFunction'],
  data () {
      return {
      }
  }
}
</script>
<style lang="stylus">
.shoutout
    text-align center
    font-size 1em
    font-weight 500
    position relative
    width 50%
    .copy
        position absolute
        top 20%
        left 5%
        width 90%
        right 5%
        text-align left
        h3
            margin-top 0
            font-size 3.8em
            color rgba(185,215,215,.95)
        .cta
            font-size 1.2em
            letter-spacing .1rem
            font-weight 800
            width 100%
            height 40px
            border none 
            color #f2f2f2
            cursor pointer
            text-transform uppercase
            background #bbbbd9
            margin-bottom 30px
    &:nth-child(odd)
        .copy
            h3
                color #bbbbd9
            .cta
                background rgba(185,215,215,.95)
    img 
        max-width 90%
@media screen and (max-width 800px)
    .shoutout
        width 100%
</style>
