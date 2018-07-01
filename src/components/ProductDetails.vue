<template>
    <div class="product-details" :class="{more :show}">
        <div v-if="!isDesktop && show" @click="deactivate" class="close" v-html="exitIcon">
        </div>
        <div v-if="!show" class="moreInfo">
            <h3>This tank is perfect for any occasion, minimal and chic</h3>
            <h4 @click="activate">more details</h4>
        </div>
        <div v-show="show" ref="details" class="details">
            <ul class="categories">
                <li v-for="(option,key) in options"
                    :class="{option:true, active:key === activeOption}"
                    :key="key"
                    @click="()=>{activeOption = key}"
                >
                    {{option.value}}
                </li>
                
            </ul>
            <div class="content">
                {{categories[options[activeOption].value]}}
            </div>
        </div>
    </div>    
</template>
<script>
import Swipe from '@/resources/swipe'
import exit from '@/assets/exit.svg'
export default {
    name : 'product-details',
    props : ['active', 'activate', 'deactivate', 'product', 'isDesktop', 'fabric', 'modelInfo'],
    data() {
        return {
            activeOption : 0,
            options : [
                {
                    value : 'info'
                },
                {
                    value : 'material'
                },
                {
                    value : 'fit'
                }
            ],
            categories : {
                info : this.product.description,
                material : {
                    name : this.fabric.name,
                    tagline: this.fabric.details.tagLine,
                    traits : this.fabric.details.traits.map(each => each.display)
                },
                fit: this.modelInfo
            },
            exitIcon: exit
        }
    },
    computed:{
        show(){
            return this.active || this.isDesktop
        }
    },
    mounted(){
        new Swipe(this.$refs.details, function(e, direction){console.log(direction)})
    },
    methods : {
    }
}
</script>
<style lang="stylus">
.product-details
    position relative
    transition .3s
    &.more
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
                &.active
                    color initial
        .content
            display flex
            height 100%
            align-items center
            padding 0px 40px
            text-align center
            font-size .95em
            font-weight 500
@media screen and (min-width 801px)
    .product-details
        width 80%
        margin-top 20px
</style>