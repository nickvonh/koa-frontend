<template>
    <div class="product-details">
        <div ref="details" class="details">
            <ul class="categories">
                <li v-for="(option,key) in options"
                    :class="{option:true, active:key === activeOption}"
                    :key="key"
                    @click="()=>{activeOption = key}"
                >
                    {{option !== 'reviews' ? option : null}}
                    <div v-if="option === 'reviews'">
                        {{reviewAvg.avg}}
                        <svg class="star" v-html="star"/>
                    </div>
                </li>
                
            </ul>
            <div v-if="options[activeOption] === 'description' || options[activeOption] === 'fit'" class="content">
                {{activeCategory}}
            </div>
            <div v-if="options[activeOption] === 'material'" class="content material">
                <div class="material-display">
                    <h4>{{activeCategory.name}}</h4>
                </div>
                <div class="trait-list">
                    <div class="trait" v-for="(trait, key) in activeCategory.traits" :key="key">
                        <svg class="trait-icon" v-html="trait.icon"/>
                        <p class="trait-display">{{trait.display}}</p>
                    </div>
                </div>
            </div>
            <div class="content review-content" v-if="options[activeOption] === 'reviews' && !!reviews">
                <label>{{reviewAvg.count}} review{{reviewAvg.count !== 1 ? 's' : null}} – {{reviewAvg.avg}}
                        <svg class="star" v-html="star"/></label>
                <div class="reviews">
                    <div class="review" v-for="(each,key) in reviews" :key="key" @click="activeReview = true">
                        <div class="review-head">
                            <star-rating 
                                :rating="each.rating"
                                :star-size="10"
                                :read-only="true"
                                text-class="rating-text">
                            </star-rating>
                            <h4>{{each.user}}</h4>
                        </div>
                        <p class="body">{{each.body}}</p>
                    </div>
                </div>
                <div class="review-modal" v-if="activeReview">
                    <svg class="close-modal" @click="activeReview = false">
                        <use xlink:href="#icon-remove"></use>
                    </svg>
                    <div class="active-review" v-for="(each,key) in reviews" :key="key">
                        <div class="review-head">
                            <star-rating 
                                :rating="each.rating"
                                :star-size="10"
                                :read-only="true"
                                text-class="rating-text">
                            </star-rating>
                            <h4>{{each.user}}</h4>
                        </div>
                        <p class="body">{{each.body}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>
<script>
import Hammer from 'hammerjs'
import exit from '@/assets/exit.svg'
import StarRating from 'vue-star-rating'
import star from '@/assets/star.svg'

export default {
    name : 'product-details',
    props : ['active', 'activate', 'deactivate', 'product', 'isDesktop', 'fabric', 'modelInfo', 'reviews'],
    components : {StarRating},
    data() {
        return {
            activeOption : 0,
            exitIcon: exit,
            activeReview: false,
            star: star,
            hammer: null
        }
    },
    computed:{
        mappedCategories(){
            if(!!this.reviews){
                return new Map([
                    ['description', this.product.description],
                    ['material', !!this.fabric ? {
                        name : this.fabric.name,
                        tagline: this.fabric.details.tagLine,
                        traits : this.fabric.details.traits,
                        touch : this.fabric.details.touch
                    } : {name : 'coming soon'} ],
                    ['fit', this.modelInfo],
                    ['reviews', this.reviews]
                ])
            }else{
                return new Map([
                    ['description', this.product.description],
                    ['material', !!this.fabric ? {
                        name : this.fabric.name,
                        tagline: this.fabric.details.tagLine,
                        traits : this.fabric.details.traits,
                        touch : this.fabric.details.touch
                    } : {name : 'coming soon'}],
                    ['fit', this.modelInfo]
                ])
            }
        },
        activeCategory(){
            return this.mappedCategories.get(this.options[this.activeOption])
        },
        options(){
            return [...this.mappedCategories].map(e => e[0])
        },
        show(){
            return this.active || this.isDesktop
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
    },
    mounted(){
        this.hammer = new Hammer(this.$refs.details, {
            threshold : 100,
            velocity : 1
        })

        this.hammer.on('swipe', (e)=>{
            if(e.deltaX < -100){
                if(this.activeOption < [...this.mappedCategories].length -1){
                    this.activeOption++
                }
            }else if(e.deltaX > 100){
                if(this.activeOption > 0){
                    this.activeOption--
                }
            }
        })
    },
    methods : {
        shortDate(date){
            let dateObj = new Date(date)
            return dateObj.toLocaleDateString()
        }
    }
}
</script>
<style lang="stylus">
.product-details
    position relative
    transition .3s
    height 20vh
    .moreInfo
        font-size 1em
        font-weight 600
        background white
        width 100%
        font-size .5em
        display flex 
        flex-direction column
        justify-content center
        align-items center
        max-height 50px
            img
                width auto 
                height 20px
        h3,h4
            margin 5px
        h4
            color green
    .close
        position absolute
        left 0px
        top 0px
        background white
        font-size .5em
        display flex
        width 40px
        height 10px
        justify-content center
        align-items center
        transform translateY(-200%)
        .exit-icon
            fill red
            height 100%
    .details
        width 100%
        height 100%
        display flex
        flex-direction column
        justify-content flex-start
        user-select none
        .categories
            display flex
            justify-content space-between
            margin 0
            width 100%
            border-bottom 2px #f2f2f2 solid
            padding-bottom 5px
            .option
                flex 1
                text-align center
                text-transform uppercase
                font-size .7em
                color #b7b7b7
                transition .3s ease
                cursor pointer
                padding .5rem
                &.active
                    color initial
        .star
            width 10px
            height 10px
        .content
            display flex
            height 100%
            width 100%
            align-items center
            padding 0px 40px
            text-align center
            font-size .95em
            font-weight 500
            justify-content center
            padding 0 10%
            box-sizing border-box
            &.review-content
                padding 0
                flex-direction column
                justify-content flex-start
                label
                    margin 5px 0
                    font-weight 500
            .reviews
                width 100%
                align-self center
                overflow-x scroll
                box-sizing border-box
                padding 0
                position relative
                display flex
                align-items center
                text-align center
                font-size .95em
                font-weight 500
                .review
                    width 80%
                    padding 15px
                    font-size .8rem
                    text-align left
                    background #f2f2f2
                    border-radius 5px
                    margin 0 10px
                    box-sizing content-box
                    .review-head
                        display flex
                        justify-content space-between
                        align-items flex-start
                    .body
                        white-space nowrap
                        overflow hidden
                        text-overflow ellipsis
                        width 100%
                    h4
                        margin 3px 0
            .review-modal
                position fixed
                top 0
                left 0
                width 100%
                height 100%
                background rgba(0,0,0,.7)
                overflow-y scroll
                .close-modal
                    position absolute 
                    top 10px
                    right 10px
                    height: 20px;
                    width: 20px;
                .active-review
                    width 80%
                    padding 5px
                    font-size .8rem
                    text-align left
                    background #f2f2f2
                    border-radius 5px
                    margin 40px auto
                    box-sizing content-box
                    .review-head
                        display flex
                        justify-content space-between
                        align-items flex-start
                    .body
                        width 100%
                    h4
                        margin 3px 0
            &.material
                flex-direction column
                justify-content space-around
                width 100%
                .material-display
                    margin-bottom 10px
                    h4
                        font-size .8em
                    h6
                        font-size .5em
                    h4, h6
                        margin 5px 0
                .trait-list
                    width 80%
                    display flex
                    justify-content space-around
                    align-items center
                    .trait
                        flex 1
                        display flex
                        flex-direction column
                        justify-content center
                        align-items center
                        font-size 10px
                    .trait-icon
                        max-width 20px
                        max-height 20px
                        margin-bottom 5px
                        border-radius 50%
                        border 1px solid #565656
                        padding 5px
                        fill #565656
                    .trait-display
                        max-width 100px
                        height 20px
                        text-align center
                        font-weight 600
@media screen and (min-width 801px)
    .product-details
        width 80%
        margin-top 20px
</style>