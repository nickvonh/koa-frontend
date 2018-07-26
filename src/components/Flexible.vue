<template>
    <div class="flexible">
        <div class="hero">
            <div class="copy">
                <div>
                    <h1>
                        be flexible
                    </h1>
                    <h4>
                        technical activewear that bleeds into your daily wardrobe.
                    </h4>
                </div>
                <div class="cta" @click="cta">learn more</div>
            </div>
            <div class="img-box">
                <img v-lazy="hero"/>
            </div>
        </div>
        <svg class="wave" v-if="isMobile" :width="width" height="917px" :viewBox="`0 0 ${width} 917`" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Welcome" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Mobile-Portrait" transform="translate(0.000000, -1503.000000)" fill="#D9BBBB">
                    <path d="M-10.3364273,1593.39979 C-32.1828647,1603.40558 -16.9881237,1598.45689 35.2477956,1578.55372 C172.289965,1526.3373 234.853275,1446.8333 361.787729,1562.58628 C437.475379,1662.07088 416.245934,2419.91295 320,2419.91295 C223.754066,2419.91295 254.515187,2338 -10.3364273,2338 C-186.90417,2338 -186.90417,2089.79993 -10.3364273,1593.39979 Z" id="Rectangle"></path>
                </g>
            </g>
        </svg>
        <svg class="wave" v-else :width="width" height="1733px" :viewBox="`0 0 ${width} 1733`" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Welcome" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-HD" transform="translate(0.000000, -1661.000000)" fill="#D9BBBB">
                    <path d="M-0.000671497324,2023.81214 C311.212035,1886.41831 535.640626,1796.6856 673.285102,1754.61403 C1034.39864,1644.23825 1339.57727,1616.14055 1488.39036,1754.61403 C1722.28735,1972.25974 1735.12442,2518.61965 1526.90159,3393.69378 C1203.51109,3398.00952 953.929785,3356.70739 778.157663,3269.78741 C602.385541,3182.86742 340.999653,3139.40743 -6,3139.40743 L-0.000671497324,2023.81214 Z" id="Rectangle"></path>
                </g>
            </g>
        </svg>



    </div>
</template>
<script>
export default {
    name: 'flexible',
    props: ['hero', 'cta'],
    mounted(){
      window.addEventListener('resize', ()=>{
          this.width = window.outerWidth
          this.height = window.outerHeight * .3
      })
    },
    data () {
        return {
            width : window.outerWidth,
            height: window.outerHeight * .3
        }
    },
    computed:{
        isMobile(){
            return this.width < 800
        }
    }
}
</script>
<style lang="stylus">
.flexible
    width 100vw
    position relative
    padding-top 50px
    .hero
        width 70%
        display flex
        background-repeat no-repeat
        background-size contain
        background-position 75%
        animation-name slidein
        animation-duration 1.5s
        animation-fill-mode forwards
        justify-content center
        color white
        padding 5% 15%
        .copy
            order 1
            display flex
            flex-direction column
            justify-content flex-start
            align-items flex-end
            text-align right
            flex 1
            h1
                font-size 6em
                font-weight 400
                margin-bottom 0
            h4
                font-size 3em
                font-weight 400
                margin-top 0
            .cta
                margin-top 20px
                font-size 2.7em
                font-weight 600
                order 3
                color #b6faff
                cursor pointer
    .img-box
        flex 1
        display flex
        align-items center
        img
            max-width 100%
            order 0
    .wave
        position absolute
        left 0
        top 0
        z-index -1
        transform translateY(-15%)
        
@media screen and (max-width 800px)
    .flexible
        width 100%
        padding-top 0
        .hero
            flex-direction column
            align-items center
            .copy
                order 0
                margin-bottom 50px
                text-align center
                font-size .5em
            img
                order 1
                width 100%
                height auto
            .cta
                margin-top 20px
                font-size 2.7em
                font-weight 400
                order 3
                color #b6faff
                width 100%
</style>

