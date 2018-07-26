<template>
<div>
    <div class="collection-hero" ref="hero" v-if="!activeProd && collectionImage" v-lazy:background-image="collectionImage"><h1>{{collection}}</h1></div>
    <ul class="prodLoop" v-if="!activeProd && !!prodsByCollection" :key="collection">
            <prod-tile 
                v-for="product in prodsByCollection"
                :product="product"
                :key="product.id">
            </prod-tile>
    </ul>
    <router-view v-if="!!selectedProd" :prodId="selectedProd.id"/>
</div>
</template>
<script>
import gql from 'graphql-tag'
import queries from '@/resources/query'
import ProdTile from './ProdTile.vue' 
import Hammer from 'hammerjs'

export default {
    name: 'prod-loop',
    props: ['collection', 'collections', 'products', 'group'],
    components: { ProdTile },
    data () {
        return {
            hammer: null
        }
    },
    mounted(){
        this.preloadImages(this.allImages)
        if(!this.activeProd && !!this.$refs.details){
            this.hammer = new Hammer(this.$refs.details, {
                threshold : 100,
                velocity : 1
            })

            this.hammer.on('swipe', (e)=>{
                if(e.deltaX < -100){
                    if(this.activeOption < [...this.mappedCategories].length -1){
                        this.activeOption++
                    }
                }else if(e.deltaX > 100){
                    if(this.activeOption > 0){
                        this.activeOption--
                    }
                }
            })
        }
    },
    watch : {
        collection(nu,old){
            console.log(nu, old)
        }
    },
    computed: {
        prodsByCollection(){
            if(!!this.products && !this.group){
                let prods = this.products.filter(p => p.collections.edges.find(e => e.node.handle === this.collection))
                return prods
            }else if(!!this.products && !!this.group){
                let prods = this.products.filter(p => p.tags.find((e)=>{
                    let regex = new RegExp(this.group, 'i')
                    return !!regex.test(e)
                }))
                return prods
            }
        },
        activeProd(){
            return !!this.$route.params.product
        },
        selectedProd(){
            if(!!this.products){
                return this.products.find(p => p.handle === this.$route.params.product)
            }
        },
        allImages(){
            if(!!this.products){
                return this.products.map(p => p.images.edges[0].node.src)
            }
        },
        collectionImage(){
            if(!!this.collection && !!this.collections){
                let collectionObj = this.collections.find(c => c.handle === this.collection);
                console.log(collectionObj);
                if(!!collectionObj && !!collectionObj.image){
                    return collectionObj.image.src
                }
            }
        }
    },
    methods :{
        async preloadImages() {
            if(this.allImages){

                function loadImage(src) {
                    return new Promise(function(resolve, reject) {
                        var img = new Image();
                        img.onload = function() {
                            resolve(img);
                        };
                        img.onerror = img.onabort = function() {
                            reject(src);
                        };
                        img.src = src;
                    });
                }

                let srcs = this.allImages;
                
                var results = [];
                
                for (var i = 0; i < srcs.length; i++) {
                    let img = await loadImage(srcs[i])
                    results.push(img);
                }

                return results
            }
        }
    }
}

</script>
<style lang="stylus" scoped>
.collection-hero
    height 250px
    width 100%
    background-size contain
    background-position 50% 40%
    background-repeat no-repeat
    display flex
    justify-content center
    align-items center
    background-color #f2f2f2
    margin-bottom 20px
    transition .3s background-position-x ease
    h1
        color #2d3e4f
        font-size 2.5em
        font-weight 600
        margin 10px 0
        background #f2f2f2b3
        width 100%
        height 100%
        display flex
        justify-content center
        align-items center
.collection-hero[lazy="loading"]
    opacity 0
    background-position-x 100%

.collection-hero[lazy="loaded"]
    opacity 1
    background-position-x 20% !important
.prodLoop 
    display flex 
    flex-flow row wrap 
    justify-content space-around 

@media screen and (max-width 800px)
    .collection-hero
        height 150px
        background-size 110%

    .collection-hero[lazy="loaded"]
        opacity 1
        background-position-x 50% !important


@media screen and (max-width 1024px)
    .prodLoop
        margin-top 0
        flex-direction column 
        align-items center


</style>
