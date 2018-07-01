<template>
    <div :class="[color, {shoutout:true}]" v-lazy:background-image="image" @click="clickFunction">
        <h3>{{cta}}</h3>
    </div>
</template>
<script>


export default {
  name : 'shoutout',
  props: ['cta', 'image', 'color', 'clickFunction'],
  data () {
      return {
      }
  }
}
</script>
<style lang="stylus">
.ash
    background-color #D9D6D6
.cream
    background-color #F4F2EC
.mint
    background-color #ECF2F4
.shoutout
    width 30%
    height calc(400px - 2.5%)
    background-size contain
    background-repeat no-repeat
    height 40vh
    cursor pointer
    h3
        font-size 2em
        transform translateY(-175%)

@media screen and (max-width 800px)
    .shoutout
        height 50vh
        width 100%
        padding 0
        margin 15% 0
        h3
            font-size 1.5em
            transform translateY(-175%)
</style>
