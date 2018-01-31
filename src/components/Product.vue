<template>
    <div v-if="prodObj" :key="prodId" class="prod-section">
        <div :class="{addBox:true, 'prod-lock':locked}">
            <div class="prod-head">
                <h1 class="title">{{prodObj.title}}</h1>
                <span class="price">${{priceObj.price}} <s v-if="!!priceObj.ogPrice && priceObj.ogPrice !== 'NaN'">${{parseInt(priceObj.ogPrice)}}</s></span>
                <img :src="lockIcon" @click="back()" class="lockButton"/>
            </div>
            <ul class="swatches">
                <li v-for="(color, key) in colors" :key="key" @click="selectColor(color)" :class="{active:isColor(color),color:true}">
                    <button :class="{active:isColor(color),swatch:true}" :style="{background : findSwatch(color) || 'transparent'}"></button>
                </li>
            </ul>
            <ul class="sizes">
                <li v-for="size in sizes" :key="size" :class="{active:isSize(size), size:true}">
                    <button @click="selectSize(size)" class="swatch sizeButton">
                        {{size}}
                    </button>
                </li>
            </ul>
            <div v-if="!!selectedSize && !!colorVariants && !!available" :key="1">
                <button @click="addToCart(JSON.stringify(finalVariant))" :class="{'add-button' : true, adding:adding}">add to cart</button>
            </div>
            <div v-if="!!selectedSize && !!colorVariants && !available" :key="1">
                <button disabled class="add-button sold-out">sold out</button>
            </div>
        </div>
        <transition name="image-transition">
            <ul class="gallery" ref="gallery">
                <li v-for="(img, key) in currentImages" :key="img.src">
                    <img class="thumbnail" :src="img.src" @click="imgFunc(key)"/>
                </li>
            </ul>
        </transition>
        <span class="current-color">{{color}}</span>
        <div class="prod-details">
            

            <div class="profile">
                <h4 class="mini-header">Details</h4>
                <hr>
                <div class="description" v-html="prodObj.descriptionHtml"></div>
                <span class="wearing" v-if="modelInfo">{{modelInfo.value}}</span>
            </div>
            
            <div class="profile">
                <h4 class="mini-header">Material Profile</h4>
                <hr>
                <h5>
                    {{fabric.name}}
                    <router-link :to="`/fabrics/${fabric.name.toLowerCase().replace(' ','-')}`">learn more</router-link>
                </h5>
                <p class="fabric" v-if="fabric" v-html="fabric.details.tagLine"></p>
                <h5>Fabric Traits</h5>
                <ul v-if="detailsArr" class="attributes">
                    <li v-for="(each, key) in fabric.details.traits" :key="key">
                        <img :src="each.icon" class="attribute-icon"></img>
                        <span>{{each.display}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="reviews" v-if="reviews">
            <h4 class="mini-header">Reviews</h4>
            <hr>
            <div class="review" v-for="(each,key) in reviews" :key="key">
                <star-rating 
                    :rating="each.rating"
                    :star-size="20"
                    :read-only="true"
                    text-class="rating-text"></star-rating>
                <p class="body">{{each.body}}</p>
                <div class="foot">
                    <p>{{each.user}}</p>
                     <span>{{shortDate(each.date)}}</span>
                </div>
               
            </div>
        </div>
        <div class="igFeed" v-if="!!igProdImages && igProdImages.length > 0">
            <h4 class="mini-header">Koa in the real world</h4>
            <h6>#TeamKoa #ActiveEveryDay</h6>
            <hr>
            <ul class="gallery" ref="gallery">
                <li v-for="(img, key) in igProdImages" :key="key">
                    <img class="thumbnail" :src="img.thumbnail_resources[2].src" @click="igFunc(img)"/>
                </li>
            </ul>
        </div>
        <router-view :images="currentImages" :prodObj="prodObj"></router-view>
    </div>
</template>
<script>
import Swipe from '@/resources/swipe'
import gql from 'graphql-tag'
import queries from '@/resources/query'
import swatches from '@/resources/swatches'
import expand from '@/assets/expand.svg'
import back from '@/assets/back.svg'
import Events from './Bus.js'
import brushed from '@/assets/brushed.svg'
import insulate from '@/assets/insulate.svg'
import lite from '@/assets/lite.svg'
import dry from '@/assets/dry.svg'
import perforated from '@/assets/perforated.svg'
import spinner from '@/assets/spinner.svg'
import fabrics from '@/resources/fabrics.js'
import reviews from '@/resources/reviews'
import StarRating from 'vue-star-rating'
import axios from 'axios'

export default {
    name: 'prod-page',
    props: ['product', 'prodId', 'color'],
    components : {StarRating},
    beforeDestroy(){
        document.removeEventListener('scroll', this.listener, false)
    },
    data () {
        let review_data = reviews.filter(r => r.product_handle === this.product).map((r)=>{
            let obj = {
                user : r.author,
                body : r.body,
                date : r.created_at,
                location: r.location,
                rating: r.rating,
            }

            return obj
        })

        if(review_data.length === 0){
            review_data = false
        }
        return {
            swatches : swatches.swatches,
            pause: false,
            locked: false,
            selectedSize: null,
            adding:false,
            spinner: spinner,
            fullGallery: false,
            fullImgKey: -1,
            prodObj: false,
            reviews: review_data,
            igFeed: null,
            fabrics: fabrics.fabrics,
            modelIndex: [
                {
                    name: 'serena',
                    value : `Serena is 5'5 – wearing S`
                },
                {
                    name: 'andi',
                    value: `Andi is 5'7 – wearing XS`
                },
                {
                    name: 'kelly',
                    value: `Kelly is 5'5 – wearing M`
                },
                {
                    name: 'dana',
                    value: `Dana is 5'7 – wearing S`
                },
                {
                    name: 'ying',
                    value: `Ying is 5'4 – wearing XS`
                }
            ],
            fabricsIndex : [
                {
                    name : 'nylon-spandex',
                    display: 'Nylon Stretch Blend'
                }
            ],
            detailsIndex : [
                {
                    name : 'brushed',
                    icon : brushed,
                    display: 'ultra-soft brushed fleece'
                },
                {
                    name : 'insulating',
                    icon : insulate,
                    display: 'insulating shell'
                },
                {
                    name : 'dry',
                    icon : dry,
                    display: 'fast wicking dry fabric'
                },
                {
                    name : 'light',
                    icon : lite,
                    display: 'light weight'
                },
                {
                    name : 'perforated',
                    icon : perforated,
                    display: 'laser cut ventilation panel'
                }
            ]
        }
    },
    computed : {
        fabric(){
            if(!!this.tags){
                let tag = this.tags.find(tag => {
                    return tag.type === 'fabric' && tag.value !== 'nylon-spandex'
                }).value

                return this.fabrics.find(f => f.name.toLowerCase().replace(' ','-') === tag)
            }
        },
        shopId(){
            return atob(this.prodId).match(/([0-9]+)/)[1]
        },
        igImages(){
            if(this.igFeed){
                return this.igFeed.user.media.nodes
            }
        },
        igProdImages(){
            if(this.igImages){
                return this.igImages.filter((image)=>{
                    let regex = new RegExp(this.product.replace(/\-/g,' '))
                    return !!regex.test(image.caption)
                })
            }
        },
        tags() {
            let match = this.prodObj.tags.map((each) => {
                let match = each.match(/([a-z]+)\-([a-z]+.[a-z]+)/)
                let type = match[1]
                let value = match[2]
                return {type, value}
            })
            return match
        },
        fullImg(){
            if(this.fullImgKey > -1){
                return this.currentImages[this.fullImgKey]
            }
        },
        detailsArr(){
            let tags = this.tags.filter(tag => tag.type === 'details').map((tag)=>{
                console.log(tag)
                let match = this.detailsIndex.find(detail => detail.name === tag.value)
                if(!!match){
                    tag.display = match.display
                    tag.icon = match.icon
                    return tag
                }else{
                    return false
                }
                
            })
            return tags || null
             
        },
        available(){
            return this.finalVariant.available
        },
        lockIcon(){
            return back
        },
        colorVariants(){
            if(!!this.$route.params.color && !!this.prodObj){
                let arr = this.prodObj.variants.edges.filter((v) => {
                    let color = v.node.selectedOptions.find(e => e.name === "Color")
                    let tests = this.$route.params.color.split('-')
                    let counter = 0
                    for(let each in tests){
                        let regex = new RegExp(tests[each],'i')
                        if(!!regex.test(color.value)){
                            counter++
                        }
                    }
                    console.log('counter',counter)
                    return counter === tests.length
                })
                console.log(arr)
                return arr
            }
        },
        finalVariant(){
            if(!!this.colorVariants && !!this.selectedSize){
                let variant = this.colorVariants.find( (v) => {
                    let size = v.node.selectedOptions.find(e => e.name === 'Size')
                    if(size.value === this.selectedSize){
                        return v
                    }
                })
                return variant.node
            }
        },
        colors() {
            if(!!this.prodObj){
                return this.prodObj.options.find(item => item.name === "Color").values
            }
        },
        sizes() {
            if(!!this.prodObj){
                return this.prodObj.options.find(item => item.name === 'Size').values
            }
        },
        priceObj() {
            if(!!this.prodObj){
                return {
                    price : parseInt(this.prodObj.variants.edges[0].node.price),
                    ogPrice: parseInt(this.prodObj.variants.edges[0].node.compareAtPrice)
                }
            }
        },
        allImages() {
            if(!!this.prodObj){
                return this.prodObj.images.edges.map( i => i.node.src )
            }
        },
        currentImages() {
            if(!!this.color && !!this.prodObj){
                console.log('current,images',this.color)
                let reg = new RegExp(this.color)
                return this.prodObj.images.edges.filter(i => !!reg.test(i.node.altText.replace(/\//g,'-').replace(' ','-'))).map(i => i.node)
            }else if(!!this.prodObj){
                let reg = new RegExp(this.colors[0], 'i')
                return this.prodObj.images.edges.filter(i => !!reg.test(i.node.altText.replace(/\//g,'-').replace(' ','-'))).map(i => i.node)
            }
        },
        modelInfo(){
            if(!!this.currentImages.length > 0){
                let name = this.currentImages[0].altText.match(/model\-([a-z]+)/)[1]
                return this.modelIndex.find(model => model.name === name)
            }
        }
    },
    methods : {
        shortDate(date){
            let dateObj = new Date(date)
            return dateObj.toLocaleDateString()
        },
        listener(e){
            function getScroll(element){
                return element.offsetTop - window.scrollY
            }

            let addBox = document.querySelector('.addBox')
            let header = document.querySelector('.header')
            let section = document.querySelector('.prod-section')
            
            if(!!addBox){
                if(getScroll(addBox) < 0 && getScroll(section) < 0 && !addBox.classList.contains('prod-lock')){
                    addBox.classList.add('prod-lock')
                    section.classList.add('prod-lock')
                    console.log('add-box scroll past 0')
                }
                if(!!addBox.classList.contains('prod-lock') && getScroll(section) > 0){
                    console.log('got it')
                    addBox.classList.remove('prod-lock')
                    section.classList.remove('prod-lock')
                }
            }
            
        },
        imgFunc(key){
            this.fullImgKey = key
            this.$router.push({path : this.$route.params.color + '/gallery', params: {index : key}})
        },
        igFunc(img){
            window.open(`https://instagram.com/p/${img.code}`, "_blank")
        },
        selectColor(color){
            color = color.toLowerCase().replace(/\//g,'-').replace(' ','-')
            this.$router.replace({path : color, params: {product: this.product, color: color}})
            this.$refs.gallery.scrollLeft = 0;
        },
        selectSize(size){
            this.selectedSize = size
            localStorage.selectedSize = size
        },
        isColor(color) {
            color = color.replace('/','-').replace(' ','-')
            let regex = new RegExp(color,'i')
            return !!regex.test(this.$route.params.color)
        },
        isSize(size){
            return this.selectedSize === size
        },
        findSwatch(color){
            let colors = color.split('/')
            let arr = []
            for(let each in colors){
                let color = colors[each].replace(' ','-').toLowerCase()

                let match = this.swatches.find( swatch => swatch.name === color)
                arr.push(match['hex'])
            }
            if(arr.length === 1){
                return arr[0]
            }else{
                return `linear-gradient(135deg, ${arr[0]} 0%,${arr[0]} 50%,${arr[1]} 51%,${arr[1]} 100%)`
            }
        },
        prodLock(){
            this.locked = !this.locked
        },
        back(){
            this.$router.go(-1)
        },
        addToCart(variant){
            console.log(Events.Bus)
            this.adding = true
            setTimeout(()=>{this.adding = false}, 2000)
            this.$analytics.fbq.event('AddToCart', {
                content_name: this.$route.params.product,
                value: this.priceObj.price,
                currency: 'USD'
            })
            this.$ga.ecommerce.addProduct({
                id: this.shopId,
                name: this.product,
                category: this.$route.params.collection,
                price: this.priceObj.price,
                quantity: '1'
            })
            Events.Bus.$emit('addToCart', variant)
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
    },
    async mounted(){
        let that = this;
        if(window.innerWidth < 800){
            document.addEventListener('scroll', this.listener, false)
        } 
        this.preloadImages()



        let product = await this.$apollo.query({
            query : gql(queries.productById),
            variables : {
                id : that.prodId
            }
        })

        try{
            this.prodObj = product.data.node
        }catch(err){
            console.log('holy shit',err)
        }

        this.$ga.ecommerce.addImpression({
            // Provide product details in an impressionFieldObject.
            'id': this.shopId,
            'name': this.product,
            'category': this.$route.params.collection,
            'brand': 'Koa',
            'variant': this.$route.params.color,
        })


        let igFeed = await axios.get('https://www.instagram.com/koa.nyc/?__a=1')
        this.igFeed = igFeed.data
    },
}

</script>
<style lang="stylus">

@keyframes add  
    0%
      transform scale(1)
      filter brightness(1)
    50%
      transform scale(1.025)
      filter brightness(1.3)
    100% 
      transform scale(1)
      filter brightness(1)
@keyframes slide
    from
        height 0px
    to
        height 100%
.current-color
    font-size .7em
.attributes
    li
        display flex
        align-items center
        justify-content center
        margin 0
        margin-bottom 10px
        width 100%
        .attribute-icon
            width 25px
            margin-right 10px
        span
            font-size .75em
            font-weight 500
            color rgba(70,80,70, 1)
.mini-header
    color #8084aa
    font-size .85em
    margin 4px 0
.profile
    margin-top 30px
    p
        margin 15px 0
        font-size .8em
        font-weight 500
    .wearing,.fabric
        font-weight 500
        font-size .75em
    h5
        margin-bottom 5px
        a
            font-size .6em
            margin-left 15px
.prod-lock
    .add-button
        padding 10px
        margin-bottom 10px
.add-button
    background #56a79f
    border none
    border-radius 5px
    padding 10px
    color white
    font-weight bold
    cursor pointer
    margin-top 5px
    animation slide .5s ease
    &:focus
        outline none
    &.adding
        animation add .6s ease;
    &.sold-out
        background gray

.image-transition-enter
    opacity 0
.image-transition-enter-active
    animation fadein .2s ease
.image-transition-leave-active
    animation fadein .1s ease reverse
.image-transition-enter-to
    opacity 1
.image-transition-leave-to
    opacity 0


@keyframes fadein 
    from 
        opacity 0
    to
        opacity 1
.lockButton
    display none
.prod-head
    display flex
    flex-direction row
    justify-content center
    align-items center
    position relative
    h1
        font-size .9em
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
.swatches, .sizes
    display flex
    flex-flow row
    justify-content center
    align-items center
    max-width 400px
    height 30px
    margin 10px auto
    transition .3s ease
    .color,.size
        flex none
        width 20px
        height 20px
        padding 3px
        &:hover,&.active
                border-radius 50%
                box-shadow 0px 0px 0px 1px rgba(140,140,160,.9)
        .swatch
            border none
            border-radius 50%
            width 100%
            height 100%
            outline none
            cursor pointer
            box-shadow: 0px 0px 1px;
            padding 0
.swatches
    flex-flow row wrap
.wearing
    color rgba(70,80,70, 1)
    font-size .8em
.prod-details,.reviews
    max-width 600px
    margin 50px auto
.reviews
    .review
        background #f2f2f2
        padding 20px
        color #6b6b6b
        margin-bottom 10px
        text-align left
        .body
            font-size .85em
        .foot
            display flex
            justify-content flex-start
            align-items center
            p
                margin 0
                margin-right 15px
                margin-bottom 1px
                font-weight 600
                font-size .85em
            span
                font-size .75em
        .rating-text
            font-weight 900
            font-size 12px
            border 1px solid #cfcfcf
            padding-left 5px
            padding-right 5px
            border-radius 5px
            color #999
            background #fff
            margin-left 5px
            margin-bottom 1px
            margin-top 0

.description
    margin 4% 0 0 0
    font-size .9em
    p
        margin 5px 0
.sizes
    justify-content space-around
    .size
        width 25px
        height 25px
        display flex
        .sizeButton
            background #f2f2f2
            font-size .2em
.prod-section
    &.prod-lock
        padding-top 150px
.title
    transition .2s ease
    margin 5px 0 0 0
    font-size .8em
.price
    position absolute
    top 13px
    right 13px
    font-size .75em
    font-weight 500
    s
        color #e66d6d
.addBox
    max-width 500px
    margin 0 auto
    &.prod-lock
        position fixed
        top 0
        left 0
        width 100%
        background white
        padding 0
        max-width none
        .title
            font-size 1em
        .swatches, .sizes
            height auto
            padding 5px 0
            margin 2px auto
        .price
            position absolute
            top 13px
            right 13px
            font-size .75em
.igFeed
    margin 50px 0
    .gallery
        justify-content center
        margin-left 0
        li:first-child
            margin-left 0
        img.thumbnail
             max-width 280px
@media screen and (max-width 800px)
    .gallery
        max-width 100%
        margin-top 50px
    .igFeed
        .gallery
            justify-content flex-start
.gallery
    display flex
    flex-direction row
    overflow scroll
    max-width 95%
    margin 5px auto
    margin-top 20px
    .thumbnail
        max-width 600px
        max-height 60vh
    .prodTile 
        width 40%
.gallery.lock
    margin-top 150px !important
@media screen and (max-width 800px)
    .title
        margin 10px 0 6px 0
        font-size 1.5em
    .swatches,.sizes
        width 90%
        height auto
        padding 2.5px 0
        .color,.size
            justify-content space-around
    .sizes
        width 60%
    .lockButton
        display block
        position absolute
        top 13px
        left 17px
        width .75em
        z-index 9999
@media screen and (max-width 800px)
    .prod-details,.reviews,.igFeed
        margin 12% 6%
        text-align left
        h6
            margin 0
    .attribute-icon
        margin-right 15px
    .attributes
        li
            display flex
            align-items center
            justify-content flex-start
</style>
