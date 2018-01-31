<template>
    <carousel ref="carousel" class="full-gallery" 
    :perPage="1"
    :loop="true"
    paginationActiveColor="#2c3e50"
    paginationColor="#ffffff"
    :currentPage="index">
        <slide class="full-thumb" v-for="(each,key) in images" :key="key">
            <img :src="each.src" @click="back"/>
        </slide>
    </carousel>
</template>
<script>
import {Carousel, Slide} from 'vue-carousel'

export default {
    name: 'full-gallery',
    props: ['index','images', 'prodObj'],
    components : {Carousel, Slide},
    mounted(){
        this.$refs.carousel.currentPage = this.index
    },
    computed: {
        fullImg(){
            let key = this.$route.params.index
            return this.images[key]
        },
        color(){
            return this.$route.params.color
        },
        product(){
            return this.$route.params.product
        }
    },
    methods :{
        back(){
            this.$router.go(-1)
        }
    }
}

</script>
<style lang="stylus" scoped>
.full-gallery
    position fixed
    top 0
    left 0
    width 100vw
    height 100vh
    background #f2f2f2
    z-index 99999
    display flex
    flex-direction column
    justify-content center
    .full-thumb
        img
            width auto
            height 80vh
    .exit-gallery
        position absolute
        top 20px
        left 20px
        width 20px
</style>
