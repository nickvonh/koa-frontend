<template>
  <div class="igFeed" v-if="!!igFeed && igFeed.length > 0">
            <div class="title-box">
                <h3>Share with us on Instagram</h3>
                <h4 class="mini-header">Help us build a community of active women!</h4>
                <h5>#TeamKoa #ActiveEveryDay</h5>
            </div>
            <ul class="gallery" ref="gallery">
                <li v-for="(img, key) in igFeed" :key="key" @click="igFunc(img)">
                    <div class="overlay">
                        <div>
                            <img :src="heart" class="hearts"/>
                            <span v-if="img.likes.count">{{img.likes.count}}</span>
                        </div>
                        <div>
                            <img :src="comments" class="comments"/>
                            <span v-if="img.comments.count">{{img.comments.count}}</span>
                        </div>
                    </div>
                    <img class="thumbnail" :src="img.images.standard_resolution.url" />
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
    },
    methods : {
        igFunc(img){
            window.open(`${img.link}`, "_blank")
        }
    },
    async mounted(){
        console.log('mounted, starting ig')
        let that = this;
        let arr = [];
        getIg(false)

        async function getIg(next_url){
            if(!next_url){
                next_url = 'https://api.instagram.com/v1/users/self/media/recent?access_token=5348547313.1677ed0.db5082304bfb4a3db29e25e4fa9d4ed4'
            }

            let igFeed;
            try{
                igFeed = await axios.get(next_url)
            }catch(e){
                console.warn(e)
            }
                
            arr = arr.concat(igFeed.data.data);

            if(!!igFeed.data.pagination.next_url){
                getIg(igFeed.data.pagination.next_url)
            }else{
                that.igFeed = arr
            }
        }
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
        display flex
        padding-left 5%
        overflow scroll
        max-width 95%
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
                height 100%
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
                    cursor pointer
        img.thumbnail
             max-height 320px
@media screen and (max-width 800px)
    .gallery
        max-width 100%
</style>
