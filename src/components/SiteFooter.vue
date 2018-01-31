<template>
    <div :class="{footer:true}">
        <div class="footer-content">
            <div class="left">
                <h5>Koa NYC 2017</h5>
                <h6>
                <a href="mailto:info@koa.nyc">info@koa.nyc</a>
                </h6>
                
                <img class="social" :src="igIcon" @click="instagram"/>
                <img class="social" :src="fbIcon" @click="facebook"/>
            </div>
            <div class="right">
                <h5>Want to find out more?</h5>
                <button class="cta" @click="aboutUs">Our Story</button>
                <button class="cta" @click="fabrics">Fabrics</button>
                <button class="cta returns" @click="returns">Returns</button>
            </div>
        </div>
        <img class="squat" :src="squat"/>
    </div>
</template>
<script>
import igIcon from '@/assets/instagram.svg'
import fbIcon from '@/assets/facebook.svg'
import sqaut from '@/assets/squat_jump.gif'

export default {
    name : 'site-footer',
    data () {
        return {
            igIcon : igIcon,
            fbIcon: fbIcon,
            squat: sqaut,
            active: false
        }
    },
    methods : {
        aboutUs(){
            this.$router.push({name:'About'})
        },
        returns(){
            this.$router.push({name:'Returns'})
        },
        fabrics(){
            this.$router.push({name:'Fabrics'})
        },
        instagram(){
            window.open('https://instagram.com/koa.nyc', "_blank")
        },
        facebook(){
            window.open('https://facebook.com/koanyc', "_blank")
        }
    }
}
</script>
<style lang="stylus">
.footer
    display flex
    flex-direction column
    transition .3s ease
    padding-bottom 20px
    align-items center
    padding 0 calc((100% - 900px)*.5)
    .footer-content
        display flex
        width 100%
        .left,.right
            margin 0 10px
            flex 1
        .left
            text-align left
            a
                text-decoration none
        .right
            text-align right
            display flex
            flex-direction column
            justify-content flex-start
            align-items flex-end
            h5
                margin-bottom 15px
        .cta
            font-size .67em
            font-weight bold
            background none
            width 80px
            height 30px
            border none
            border-radius 2px
            color #a4a7c2
            cursor pointer
            text-align right
            &:focus
                outline none
    .squat
        height auto
        max-width 100px
</style>
