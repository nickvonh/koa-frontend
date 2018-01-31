<template>
    <div class="returns">
        <h3>Free & Easy Returns</h3>
        <iframe src="https://services.alveo.io/portal/auth?&amp;shop=koa-nyc.myshopify.com&amp;v1.koa.nyc/a/returns" width="100%" height="600px" marginheight="0" frameborder="0"></iframe>
        <button class="cta" @click="home">done</button>
    </div>
</template>
<script>
import igIcon from '@/assets/instagram.svg'
import fbIcon from '@/assets/facebook.svg'

export default {
    name : 'returns',
    data () {
        return {
        }
    },
    methods : {
        home(){
            this.$router.push({name:'Home'})
        }
    }
}
</script>
<style lang="stylus">
.returns
    width 100%
    .cta
        font-size .85em
        font-weight 600
        background #8084aa;
        width 80px
        height 35px
        border none
        border-radius 2px
        color white
        cursor pointer
        margin 30px 0
</style>
