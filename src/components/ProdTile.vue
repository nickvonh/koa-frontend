<template>
    <li class="prodTile">
            <carousel ref="carousel"
            :perPage="1"
            :loop="true"
            :minSwipeDistance="100"
            paginationActiveColor="#2c3e50"
            paginationColor="#ffffff">
                <slide v-for="(each,index) in currentImages" :key="index">
                    <div class="tileThumb" v-lazy:background-image="`${each.src}`" @click="selectProduct(product)"></div>
                    <!-- <img class="tileThumb" v-lazy="each.src" @click="selectProduct(product)"/> -->
                </slide>
            </carousel>
        <strong class="title-row">
            <span>{{product.title}}</span>
            <span class="prices">
                ${{parseInt(product.variants.edges[0].node.price)}}
                <s v-if="!!product.variants.edges[0].node.compareAtPrice && product.variants.edges[0].node.compareAtPrice !== 'NaN'">
                    ${{parseInt(product.variants.edges[0].node.compareAtPrice)}}
                </s>
            </span>
        </strong>
         <ul class="swatches">
            <li v-for="(color, key) in colors" :key="key" @click="selectColor(color)" :class="{active:isColor(color),color:true}">
                <button :class="{active:isColor(color),swatch:true}" :style="{background : findSwatch(color) || 'transparent'}"></button>
            </li>
        </ul>
    </li>
</template>
<script>
import swatches from '@/resources/swatches'
import {Carousel, Slide} from 'vue-carousel'
import exFull from '@/assets/images/mock-photos/tage.webp'

export default {
    name: 'prod-tile',
    props: ['product'],
    components: {Carousel, Slide},
    data (){
        return {
            exFull,
            swatches : swatches.swatches,
            colors : this.product.options.find(item => item.name === "Color").values,
            selected : 0
        }
    },
    computed: {
        color(){
            return this.colors[this.selected]
        },
        currentImages() {
            if(!!this.product){
                let reg = new RegExp(this.color.replace('/','-').replace(' ','-'), 'i')
                return this.product.images.edges.filter(i => !!reg.test(i.node.altText.replace(/\//g,'-').replace(' ','-'))).map(i => i.node)
            }
        },
        isMobile(){
            return window.outerWidth < 1024
        }
    },
    methods: {
        handler (component) {
            console.log('this component is showing')
        },
        isColor(color) {
            color = color.replace('/','-').replace(' ','-')
            let regex = new RegExp(color,'i')
            return !!regex.test(this.color)
        },
        selectProduct(product){
            console.log(product)
            let color = this.color.toLowerCase().replace(/\//g,'-').replace(' ','-')
            
            console.log(color)
            if(!!this.$route.params.group){
                this.$router.push({path:this.$route.params.group+'/'+product.handle+'/'+color, params : {product : product.handle, color : color} })
            }else{
                this.$router.push({path:this.$route.params.collection+'/'+product.handle+'/'+color, params : {product : product.handle, color : color} })
            }
        },
        selectColor(color){
            let index = this.colors.indexOf(color);
            this.selected = index
        },
        findSwatch(color){
            let colors = color.split('/')
            let arr = []
            for(let each in colors){
                let color = colors[each].replace(' ','-').toLowerCase()

                let match = this.swatches.find( swatch => swatch.name === color)
                arr.push(match['hex'])
            }
            if(arr.length === 1){
                return arr[0]
            }else{
                return `linear-gradient(135deg, ${arr[0]} 0%,${arr[0]} 50%,${arr[1]} 51%,${arr[1]} 100%)`
            }
        }
    }
}
</script>
<style lang="stylus">
.prodTile 
    display flex
    flex-direction column
    justify-content center
    align-items center
    width 30%
    cursor pointer
    background #f2f2f2
    margin 15px 0
    overflow-x hidden
    border-radius 5px
    .VueCarousel
        width 100%
        height 450px
        .VueCarousel-wrapper
            width 100%
            height 90%
            .VueCarousel-inner
                height 100%
    .tileThumb 
        width auto
        height 100%
        background-size contain
        background-position 50%
        background-repeat no-repeat
    .title-row
        width 100%
        max-width 360px
        display flex
        justify-content center
        s
            color #e66d6d
        .prices
            margin-left 15px
            font-weight 600
            -webkit-font-smoothing antialiased
            font-size .8em
            align-self center
    .swatches
        display flex
        flex-flow row
        justify-content center
        align-items center
        max-width 400px
        height 30px
        margin 10px auto
        transition .3s ease
        .color
            flex none
            width 20px
            height 20px
            padding 3px
            &:hover,&.active
                    border-radius 50%
                    box-shadow 0px 0px 0px 1px rgba(140,140,160,.9)
            .swatch
                border none
                border-radius 50%
                width 100%
                height 100%
                outline none
                cursor pointer
                box-shadow: 0px 0px 1px;
                padding 0
@media screen and (max-width 1024px)
    .prodTile 
        width 90%
        margin 25px 0
        background #f2f2f2
        .VueCarousel
            width 100%
            max-height 350px
        .title-row
            padding 10px 0
            padding-bottom 20px
            font-size 1.1em
            position relative
            justify-content center
        .prices
            margin-left 15px
            font-weight 600
            -webkit-font-smoothing antialiased
            font-size .8em

.tileThumb[lazy]
  transition .3s background-position ease

.tileThumb[lazy="loading"]
  opacity 0
  background-position 100% !important

.tileThumb[lazy="loaded"]
  opacity 1
  background-position 50% !important
</style>
