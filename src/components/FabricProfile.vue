<template>
    <div class="fabrics">
        <img :src="backIcon" @click="back()" class="backButton"/>
        <div class="fabrics-container active">
            <div class="fabric-details">
                <div v-if="!!activeFabric" class="details-container">
                    <div class="banner" :style="{backgroundImage : `url(${activeFabric.image})`}">
                        <h1>{{activeFabric.name}}</h1>
                        <div class="info">
                            <h5><span>{{activeFabric.details.weight}} weight</span></h5>
                            <h5><span>{{activeFabric.details.touch}}</span></h5>
                        </div>
                    </div>
                    <div class="details-content">
                        <div class="copy">
                            <h3 v-html="activeFabric.details.tagLine"></h3>
                        </div>
                        
                        <ul class="traits">
                            <h4>Fabric Traits</h4>
                            <li v-for="(trait,key) in activeFabric.details.traits" :key="key" class="trait">
                                <img v-if="!!trait.icon" :src="trait.icon"/>
                                <h5>{{trait.display}}</h5>
                            </li>
                        </ul>
                        <hr>
                        <h4>Products Made With This</h4>
                        <div class="gallery relatedProducts" v-if="relatedProducts">
                            <div v-for="(each,key) in relatedProducts" :key="key" class="product" @click="selectProduct(each)">
                                <img :src="each.images.edges[0].node.src"/>
                                <strong class="title-row"><span>{{each.title}}</span><span>${{parseInt(each.variants.edges[0].node.price)}} <s v-if="!!each.variants.edges[0].node.compareAtPrice && each.variants.edges[0].node.compareAtPrice !== 'NaN'">${{parseInt(each.variants.edges[0].node.compareAtPrice)}}</s></span></strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>        
    </div>
</template>
<script>
import {Carousel, Slide} from 'vue-carousel'
import fabrics from '@/resources/fabrics.js'
import back from '@/assets/back.svg'
export default {
    name : 'fabric-profile',
    props : ['products'],
    components : {Carousel, Slide},
    data () {
        return {
            fabrics : fabrics.fabrics,
            backIcon : back
        }
    },
    computed :{
        activeFabric(){
            return this.fabrics.find( fabric => fabric.name.toLowerCase().replace(" ","-") === this.$route.params.fabricName)
        },
        relatedProducts(){
            if(!!this.activeFabric && this.products){
                let products = this.products.filter( (p) => {
                    console.log(p.tags)
                    let match = p.tags.find( (tag) => {
                        let fabric = this.activeFabric.name.toLowerCase().replace(' ','-')
                        let regex = new RegExp('fabric-'+fabric)
                        console.log(tag)
                        return !!regex.test(tag)
                    })
                    return !!match
                })

                return products
            }else{
                return false
            }
            
        }
    },
    methods : {
        isActive(fabric){
            return this.activeFabric.name === fabric.name
        },
        selectProduct(product){
            let color = product.variants.edges[0].node.selectedOptions.find(p => p.name === 'Color').value.toLowerCase().replace("/","-").replace(" ","-")
            this.$router.push(`/shop/all/${product.handle}/${color}`)
        },
        back(){
            this.$router.go(-1)
        },
    }
}
</script>
<style lang="stylus">
.fabrics
    max-width 800px
    margin 0 auto
    overflow hidden
    position relative
    .fabrics-container
        display flex
        width 100%
        align-items flex-start
        .details-container
            width 100%
            .details-content
                padding 4%
        &.active
            height 100%
            flex-direction column
            align-items center
            .fabric-list
                display flex
                height 100%
                width 100%
                overflow-x scroll
                .fabric
                    max-width 75px
            .fabric-details
                text-align left
                width 100%
                font-size .8em
                display flex
                justify-content center
                .banner
                    width 100%
                    height 35vh
                    background-size cover
                    display flex
                    justify-content center
                    align-items center
                    font-weight 500
                    color white
                    display flex
                    flex-direction column
                    h3
                        margin 5px
                .info
                    text-align center
                    h5
                        font-weight 600
                        margin 5px
                        span 
                            font-size 1.2em
                            font-weight 600
                .copy
                    text-align left
                    margin-bottom 10px
                    h3
                        font-weight 600
                .traits
                    display flex
                    flex-direction column
                    align-items flex-start
                    h4
                        margin-bottom 10px
                    .trait
                        width 100%
                        display flex
                        justify-content flex-start
                        align-items center
                        margin-bottom 10px
                        img
                            height 25px
                        h5
                            margin-left 1px
                            font-size .9em
                    li,h5
                        margin 0
                h4
                    color #8084aa
                .gallery
                    flex-direction row
                    overflow scroll
                    display flex
                    justify-content flex-start
                    margin 25px 0
                    .product
                        width 45vw
                        max-width 300px
                        flex none
                        margin-left 0
                        position relative
                        display flex
                        flex-direction column
                        align-items center
                        margin-right 20px
                        img 
                            width 100%
                        .title-row
                            width 100%
                            display flex
                            justify-content space-between
                            font-weight 400
                            margin-bottom 20px
            .fabric
                height 10vh
                filter brightness(.65) grayscale(.5)
    .backButton
        display block
        position absolute
        top 35px
        left 17px
        width .75em
        z-index 9999
        filter invert(1)
</style>
