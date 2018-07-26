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
        color white
        font-weight 600
        margin 0
        background rgba(142,142,142,.1)
        width 100%
        height 100%
        padding 5%
        display flex
        justify-content flex-start
        align-items flex-start
        box-sizing border-box
    &:hover
        h3
            color #6dc6c5

@media screen and (max-width 800px)
    .shoutout
        flex 0
        flex-shrink 0
        flex-basis 80%
        height 40vh
        padding 0
        margin-right 5%
</style>
