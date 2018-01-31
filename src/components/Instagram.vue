<template>
  <div class="igFeed" v-if="!!igImages && igImages.length > 0">
            <div class="title-box">
                <h3>Share with us on Instagram</h3>
                <h4 class="mini-header">Help us build a community of active women!</h4>
                <h5>#TeamKoa #ActiveEveryDay</h5>
            </div>
            <ul class="gallery" ref="gallery">
                <li v-for="(img, key) in igImages" :key="key" @click="igFunc(img)">
                    <div class="overlay">
                        <div>
                            <img :src="heart" class="hearts"/>
                            <span>{{img.likes.count}}</span>
                        </div>
                        <div>
                            <img :src="comments" class="comments"/>
                            <span>{{img.comments.count}}</span>
                        </div>
                    </div>
                    <img class="thumbnail" :src="img.thumbnail_resources[2].src" />
                </li>
            </ul>
        </div>
</template>
<script>
import axios from 'axios'
import igSprites from '@/assets/igSpriteSheet.png'
import heart from '@/assets/heart.svg'
import comments from '@/assets/comment.png'
export default {
    name : 'instagram',
    data () {
        return {
            hover : false,
            igFeed : null,
            igSprites : igSprites,
            heart: heart,
            comments : comments
        }
    },
    computed : {
        igImages(){
            if(this.igFeed){
                return this.igFeed.user.media.nodes
            }
        }
    },
    methods : {
        igFunc(img){
            window.open(`https://instagram.com/p/${img.code}`, "_blank")
        }
    },
    async mounted(){
        let igFeed = await axios.get('https://www.instagram.com/koa.nyc/?__a=1')
        this.igFeed = igFeed.data
    }
}
</script>
<style lang="stylus">
.igFeed
    width 100%
    max-width 1400px
    overflow hidden
    background white
    .title-box
        width 100%
        height 100%
        text-align left
        padding 8%
        font-size .9em
        background #f2f2f2
        h4
            margin-bottom 5px
        h5
            margin-top 0
    .gallery
        padding-left 5%
        flex-direction row
        overflow scroll
        max-width 95%
        display flex
        margin 25px 0
        li:first-child
            margin-left 0
        li
            position relative
            display flex
            align-items center
            .overlay
                visibility hidden
                position absolute
                top 0
                left 0
                width 100%
                height 98%
                background rgba(0,0,0,.4)
                color white
                display flex
                flex-direction column
                justify-content center
                align-items center
                div
                    display flex
                    justify-content center
                    align-items center
                    img
                        width 25px
                        filter invert(1)
                        margin-right 15px
                    span 
                        font-weight 900
            &:hover
                .overlay
                    visibility visible
        img.thumbnail
             max-width 280px
@media screen and (max-width 800px)
    .gallery
        max-width 100%
</style>
