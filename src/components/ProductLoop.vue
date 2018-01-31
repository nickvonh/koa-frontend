<template>
<div>
    <ul class="prodLoop" v-if="!activeProd && !!prodsByCollection" :key="collection">
        <li v-for="product in prodsByCollection" :key="product.id" class="prodTile" @click="selectProduct(product)">
            <img :src="product.images.edges[0].node.src" class="thumbnail"></img>
            <strong class="title-row"><span>{{product.title}}</span><span>${{parseInt(product.variants.edges[0].node.price)}} <s v-if="!!product.variants.edges[0].node.compareAtPrice && product.variants.edges[0].node.compareAtPrice !== 'NaN'">${{parseInt(product.variants.edges[0].node.compareAtPrice)}}</s></span></strong>
        </li>
    </ul>
    <router-view v-if="!!selectedProd" :prodId="selectedProd.id"/>
</div>
</template>
<script>
import gql from 'graphql-tag'
import queries from '@/resources/query'

export default {
    name: 'prod-loop',
    props: ['collection', 'products', 'group'],
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
        selectProduct(product){
            let color = product.variants.edges[0].node.selectedOptions.find(option => option.name === 'Color').value.toLowerCase().replace(/\//g,'-').replace(' ','-')
            
            if(!!this.group){
                this.$router.push({path:this.group+'/'+product.handle+'/'+color, params : {product : product.handle, color : color} })
            }else{
                this.$router.push({path:this.collection+'/'+product.handle+'/'+color, params : {product : product.handle, color : color} })
            }
        },
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
.slide-down-enter
    transform translateY(-100%)
.slide-down-enter-active 
    transform translateY(0)
.slide-down-leave-to
    transform translateY(100%)
.prodLoop 
    display flex 
    flex-flow row wrap 
    justify-content space-around 
.prodTile 
    display flex
    flex-direction column
    justify-content center
    align-items center
    width 30%
    cursor pointer
    font-size .75em
    font-weight 300
.thumbnail 
    max-width 360px
    max-height 70vh
    margin 10px 0
.title-row
    width 100%
    max-width 360px
    display flex
    justify-content space-around
    s
        color #e66d6d

@media screen and (max-width 800px)
    .prodTile 
        width 90%
        margin 10px 0
</style>
