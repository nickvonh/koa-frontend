<template>
<div>
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

export default {
    name: 'prod-loop',
    props: ['collection', 'products', 'group'],
    components: { ProdTile },
    data () {
        return {
            
        }
    },
    mounted(){
        this.preloadImages(this.allImages)
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
.prodLoop 
    display flex 
    flex-flow row wrap 
    justify-content space-around 


@media screen and (max-width 1024px)
    .prodLoop
        margin-top 0
        flex-direction column 
        align-items center
</style>
