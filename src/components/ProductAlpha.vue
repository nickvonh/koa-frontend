<template>
    <div v-if="prodObj" :key="prodId" class="prod-section">
        <div class="prod-land" v-if="currentImages">

            <div class="prod-head" v-if="!isDesktop">
                <h1 class="title">{{prodObj.title}}</h1>
                <span class="price">${{priceObj.price}} <s v-if="!!priceObj.ogPrice && priceObj.ogPrice !== 'NaN'">${{parseInt(priceObj.ogPrice)}}</s></span>
            </div>

            <carousel ref="carousel"
            :perPage="1"
            :loop="false"
            :minSwipeDistance="10"
            paginationActiveColor="#2c3e50"
            paginationColor="#ffffff"
            :class="{'prod-hero':true, 'details': moreDetails, 'full': fullGallery}">
                <slide v-for="(each,index) in currentImages" class="thumb-slide" :key="index">
                    <img :src="each.src" @click="imgFunc"/>
                </slide>
            </carousel>

            <div class="interface" v-show="!fullGallery">
                <div class="prod-head" v-if="isDesktop">
                    <h1 class="title">{{prodObj.title}}</h1>
                    <span class="price">${{priceObj.price}} <s v-if="!!priceObj.ogPrice && priceObj.ogPrice !== 'NaN'">${{parseInt(priceObj.ogPrice)}}</s></span>
                </div>
                <product-details :active="moreDetails" 
                    :activate="()=>{moreDetails = true}" 
                    :deactivate="()=>{moreDetails = false}"
                    :product="prodObj"
                    :isDesktop="isDesktop"
                    :fabric="fabric"
                    :modelInfo="modelInfo.value">
                </product-details>

                <ul class="swatches">
                    <li v-for="(color, key) in colors" :key="key" @click="selectColor(color)" :class="{active:isColor(color),color:true}">
                        <div :class="{active:isColor(color),swatch:true}" :style="{background : findSwatch(color) || 'transparent'}"></div>
                    </li>
                </ul>
                <ul class="sizes">
                    <li v-for="size in sizes" :key="size" :class="{active:isSize(size), size:true}">
                        <div @click="selectSize(size)" class="sizeButton">
                            {{size}}
                        </div>
                    </li>
                </ul>
                <div :key="1" class="add">
                    <button @click="!!selectedSize && !!colorVariants && !!available ? addToCart(JSON.stringify(finalVariant)) : null" :class="{'add-button' : true, adding:adding}">add to cart</button>
                </div>
                <div v-if="!!selectedSize && !!colorVariants && !available" :key="1" class="add">
                    <button disabled class="add-button sold-out">sold out</button>
                </div>
                
            </div>
            <!-- <div class="prod-details">
                <div class="profile">
                    <div class="description" v-html="prodObj.descriptionHtml"></div>
                    <span class="wearing" v-if="modelInfo">{{modelInfo.value}}</span>
                </div>

                <div class="profile">
                    <h4 class="mini-header">Material Profile</h4>
                    <hr>
                    <h5>
                        {{fabric.name}}
                        <router-link :to="`/about/fabrics/${fabric.name.toLowerCase().replace(' ','-')}`">learn more</router-link>
                    </h5>
                    <p class="fabric" v-if="fabric" v-html="fabric.details.tagLine"></p>
                    <h5>Fabric Traits</h5>
                    <ul v-if="detailsArr" class="attributes">
                        <li v-for="(each, key) in fabric.details.traits" :key="key">
                            <img :src="each.icon" class="attribute-icon"/>
                            <span>{{each.display}}</span>
                        </li>
                    </ul>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
import queries from '@/resources/query'
import swatches from '@/resources/swatches'
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
import exFull from '@/assets/images/mock-photos/tage.webp'
import exFront from '@/assets/images/mock-photos/front.jpg'
import exFrontTwo from '@/assets/images/mock-photos/front_2.jpg'
import exBack from '@/assets/images/mock-photos/back.jpg'
import ProductDetails from './ProductDetails.vue'
import {Carousel, Slide} from 'vue-carousel'

export default {
    name: 'prod-page',
    props: ['product', 'prodId', 'color'],
    components : {StarRating, ProductDetails, Carousel, Slide},
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
            exImages: [exFull, exFront, exBack, exFrontTwo],
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
            windowWidth: window.outerWidth,
            moreDetails: false,
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
        isDesktop(){
            return this.windowWidth > 800
        },
        reviewAvg(){
            if(!!this.reviews){
                let sum = 0;
                this.reviews.forEach(n => sum += n.rating)
                return {
                    avg: sum / this.reviews.length,
                    count: this.reviews.length
                }
            }
        },
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
        igProdImages(){
            if(this.igFeed){
                return this.igFeed.filter((image)=>{
                    let regex = new RegExp(this.product.replace(/\-/g,' '))
                    return !!regex.test(image.caption.text)
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

                    return counter === tests.length
                })

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

                let reg = new RegExp(this.color)
                return this.prodObj.images.edges.filter(i => !!reg.test(i.node.altText.replace(/\//g,'-').replace(' ','-'))).map(i => i.node)
            }else if(!!this.prodObj){
                let reg = new RegExp(this.colors[0], 'i')
                return this.prodObj.images.edges.filter(i => !!reg.test(i.node.altText.replace(/\//g,'-').replace(' ','-'))).map(i => i.node)
            }
        },
        modelInfo(){
            if(this.currentImages.length > 0){
                let name = this.currentImages[0].altText.match(/model\-([a-z]+)/)[1]
                return this.modelIndex.find(model => model.name === name)
            }
        },
        schema(){
            if(!!this.currentImages){
                const schema = {
                    "@context": "http://schema.org/",
                    "@type": "Product",
                    "name": this.prodObj.title,
                    "image": this.currentImages.map(n => n.src),
                    "description": this.prodObj.description,
                    "brand": {
                        "@type": "Thing",
                        "name": "Koa"
                    }
                }
                if(!!this.reviews){
                    schema["aggregateRating"]= {
                        "@type": "AggregateRating",
                        "ratingValue": this.reviewAvg.avg,
                        "reviewCount": this.reviewAvg.count
                    }
                }

            return JSON.stringify(schema)
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
        imgFunc(){
           !this.isDesktop ? this.fullGallery = !this.fullGallery : null
        },
        igFunc(img){
            window.open(`https://instagram.com/p/${img.shortcode}`, "_blank")
        },
        selectColor(color){
            color = color.toLowerCase().replace(/\//g,'-').replace(' ','-')
            this.$router.replace({name : 'Product-Alpha', params: {product: this.product, color: color}})
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
        
    },
    async mounted(){
        let that = this;
        if(window.innerWidth < 800){
            document.addEventListener('scroll', this.listener, false)
        } 

        window.onresize = (e)=>{
            this.windowWidth = window.outerWidth
        }


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
    },
    metaInfo() {
        return {
            script: [
                {
                    innerHTML: this.schema,
                    type: 'application/ld+json'
                }
            ]
        }
    },
}

</script>
<style lang="stylus">
.prod-land
    height 100%
    flex-direction column
    align-items center
    display flex
    background #f2f2f2
    text-align left
    .addBox
        display flex
        flex-direction column
        justify-content center
        width 100%
        height 50%
    .prod-hero
        width 100%
        height 60vh
        transition .3s ease
        &.full
            height 90vh !important
        &.details
            height 42vh
        .VueCarousel-wrapper
            height 80%
            .VueCarousel-inner
                height 100%
                .thumb-slide
                    height 100%
                    width 100%
                    img
                        height 100%
                        width auto
        .VueCarousel-pagination
            height 20%
        .thumb-slide
            display flex
            justify-content center
            align-items center
    .prod-head
        display flex
        flex-direction row
        justify-content space-between
        align-items center
        position relative
        width 80%
        .title
            font-weight 600
            font-size 1.5em
        .price
            font-weight 900
            font-size 1.1em
    .interface
        display flex
        flex-direction column
        position fixed
        background white
        bottom 0
        left 0
        width 100%
        padding-top 10px
        .swatches, .sizes
            display flex
            justify-content space-around
            width 80%
            margin 0 auto
        .swatches
            padding 4% 0
            .color
                &:after 
                    content ''
                    display block
                    width 0
                    height 2px
                    background #2c3e50
                    transition width .2s
                &.active
                    &:after
                        width 100%
                    .swatch
                        margin-bottom 8px
            .swatch
                width 15px
                height 15px
                border-radius 50%
                margin 0 3px
                border 1px solid rgb(120,120,120)
        .sizes
            padding 4% 0
            // display none
            .size
                transition .3s ease
                border-color transparent
                &:after 
                    content ''
                    display block
                    width 0
                    height 2px
                    background #2c3e50
                    transition width .2s
                .sizeButton
                    font-size .8rem
                    font-weight 700
                    color grey
                    margin-bottom 0px
                    margin 0 5px
                &.active
                    &:after
                        width 100%
                    .sizeButton
                        width 100%
                        background none
                        color #2c3e50
                        margin-bottom 5px
        .add
            padding 3% 0
            display flex
            justify-content center
            .add-button
                color rgba(0,0,0,1)
                border 1px solid black 
                background none
                padding 8px 20px
    .prod-details,.reviews,.igFeed
        margin 12% 0%
        text-align left
        h6
            margin 0
@media screen and (min-height 801px) and (max-height 1000px) and (max-width 800px)
    .prod-land 
        .prod-hero
            height 70vh
            &.details
                height 50vh
@media screen and (max-height 600px)  and (max-width 800px)
    .prod-land 
        .prod-hero
            height 50vh
            &.details
                height 38vh
@media screen and (min-width 801px)
    .prod-land
        flex-direction row
        width 100%
        .prod-hero
            width 60%
            height 100vh
            &.full
                height 100vh !important
            &.details
                height 100vh
            .VueCarousel-wrapper
                height 90%
                .VueCarousel-inner
                    height 100%
                    .thumb-slide
                        height 100%
                        width 100%
                        img
                            height 100%
                            width auto
            .VueCarousel-pagination
                height 10%
            .thumb-slide
                display flex
                justify-content center
                align-items center
        .interface
            width 40%
            height 100vh
            position initial
            align-items center
</style>
