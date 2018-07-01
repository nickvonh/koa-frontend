<template>
    <div class="mob-nav">
        <div class="category" v-for="each of categories" :key="each">
            <div @click="!!each.extra ? each.show = !each.show : null">{{each.name}}</div>
            <div v-if="each.extra && each.show" class="extra">
                <div v-for="item of each.extra" :key="item" class="item">
                    {{item}}    
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>


export default {
  name : 'mob-nav',
  props: ['headline', 'copy', 'image', 'clickFunction'],
  data () {
      return {
          categories : [
              {
                  name : 'shop',
                  extra : [
                      'shop all',
                      'tops',
                      'bottoms',
                      'outer layers'
                  ],
                  show:false
              },
              {
                  name : 'learn',
                  extra : false
              },
              {
                  name : 'cart',
                  extra : false
              },
              {
                  name : 'newsletter',
                  extra : false
              },
          ]
      }
  }
}
</script>
<style lang="stylus">
.mob-nav
    display none
@media screen and (max-width 800px)
    .mob-nav
        position fixed
        bottom 0
        left 0
        width 100%
        height 60px
        background blue
        color white
        display flex
        .category
            display flex
            justify-content center
            align-items center
            flex 1
            border white 1px solid
            .extra
                position fixed
                left 0
                bottom 0
                display flex
                width 100%
                height 60px
                background black
                transform translateY(-100%)
                .item
                    display flex
                    height 100%
                    flex 1
                    border white 1px solid
                    justify-content center
                    align-items center

</style>
