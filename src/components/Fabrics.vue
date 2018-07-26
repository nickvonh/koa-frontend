<template>
    <div class="fabrics">
        <h3>Fabrics</h3>
        <p>
            Our Building Blocks
        </p>
        <div :class="{'fabrics-container' : true, active : !!activeFabric}">
            <div class="fabric-list">
                <div :class="{fabric:true, active : isActive(fabric)}" v-for="(fabric,key) in fabrics" :key="key" @click="selectFabric(fabric)">
                    <div class="title" :style="{backgroundImage : `url(${fabric.image})`}">
                        {{fabric.name}}
                    </div>
                </div>
            </div>
        </div>        
    </div>
</template>
<script>
import {Carousel, Slide} from 'vue-carousel'
import fabrics from '@/resources/fabrics.js'
export default {
    name : 'fabrics',
    props : ['products'],
    components : {Carousel, Slide},
    data () {
        return {
            fabrics : fabrics.fabrics,
            activeFabric : false
        }
    },
    computed :{
        relatedProducts(){
            if(this.activeFabric){
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
        selectFabric(fabric){
            this.$router.push({path:`/about/fabrics/${fabric.name.toLowerCase().replace(' ','-')}`})
        },
        isActive(fabric){
            return this.activeFabric.name === fabric.name
        },
        selectProduct(product){
            this.$router.push(`/shop/all/${product.handle}`)
        }
    }
}
</script>
<style lang="stylus">
.fabrics
    max-width 800px
    margin 0 auto
    overflow hidden
    .fabrics-container
        display flex
        width 100%
        align-items flex-start
        .fabric-list  
            padding 0
            display flex
            flex-flow row wrap
            justify-content space-around
            flex 1
            .fabric
                width 80%
                display flex
                flex-direction column
                margin-bottom 2vh
                cursor pointer
                &.active,&:hover
                    filter none
                .title
                    width 100%
                    height 25vh
                    background-size cover
                    display flex
                    justify-content center
                    align-items center
                    color white
                    font-weight 500
                    font-size .85em
                    border-radius 5px
                .fabric-details
                    height 0
                    background #f2f2f2
                    font-weight 600
                    transition .3s ease
                    display flex
                    justify-content space-around
                    align-items center
                    overflow hidden
                    text-align left
</style>
