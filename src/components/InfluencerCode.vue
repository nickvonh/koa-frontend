<template>
    <div class="influencer-box">
        <div class="influencer-field-group" v-if="!applied">
            <h2>Referal code</h2>
            <h5>Input your code here and we'll match it!</h5>
            <input type="text"  class="required email" v-model="influencerCode">
        </div>
        <div class="result" v-if="!!igMatch.profile">
            <div>
                <div class="thumb">
                    <img :src="igMatch.profile" />
                </div>
            </div>
            <div>
                <h3>@{{igMatch.username}}</h3>
                <button v-if="!applied"@click="applyCode">Apply this code</button>
                <button v-else disabled class="applied">Code Applied!</button>
            </div>
        </div>
    </div>
</template>
<script>
import Events from './Bus.js'
import influencers from '@/resources/influencers.json'
import axios from 'axios'

export default {
    name : 'influencer-code',
    data (){
        return {
            influencerList: influencers,
            influencer: false,
            influencerCode: '',
            igMatch: {
                profile: false,
                username: false,
                code: false
            },
            applied: false
        }
    },
    methods : {
        applyCode(){
            let code = this.igMatch.code
            if(!!code){
                Events.Bus.$emit('addCouponCode', code)
                this.applied = true
                localStorage.subscribed = 'true'
                document.dispatchEvent(new Event('checkCoupon'))
            }else{
                console.warn(`error, no code`)
            }
        }
    },
    watch : {
        async influencerCode(val) {
            let influencer = this.influencerList.find(response => {
                let test = val.toLowerCase()
                return response.code.toLowerCase() === test
            })
            if(!!influencer){
                console.log(influencer.ig)
                this.igMatch.code = influencer.code
                this.discount = 20
                this.igMatch.username = influencer.ig
                let user = await axios.get(`https://www.instagram.com/${influencer.ig}/`)
                if(!!user){
                    let thumb = user.data.match(/\"profile_pic_url\"\:\"(.*?\.jpg)\"/)[1]
                    this.igMatch.profile = thumb
                }
                
            }
        }
    },

}
</script>
<style lang="stylus">
.cart
    .influencer-box
        width 80%
        height 80%
        padding 10%
        padding-top 0
        display flex
        flex-direction column
        justify-content space-around
        align-items center
        position absolute 
        top 0
        left 0
        background #f2f2f2
.influencer-box
    width 100%
    height 100%
    display flex
    align-items center
    .influencer-field-group
        text-align left
        width 40%
        transition .3s ease
        input
            font-size 1.5em
            padding 5px
    .result
        width 100%
        display flex 
        justify-content space-around
        align-items center
        div
            button
                font-size .85em
                font-weight 600
                background #56a79f
                width 100%
                max-width 200px
                height 40px
                border none
                border-radius 2px
                color white
                cursor pointer
                &.applied
                    background gray
                    cursor initial
        .thumb
            margin 0 auto
            width 120px
            height 120px
            border-radius 50%
            border 1px solid transparent
            overflow hidden
            display flex
            justify-content center
            align-items center
            img
                max-width 100%
@media screen and (max-width 800px)
    .influencer-box
        margin 0 auto
        width 90%
        height 100%
        display flex
        justify-content center
        align-items center
        h2, h3, h5
            margin-top 0
        .influencer-field-group
            text-align left
            width 80%
            transition .3s ease
            input
                font-size 1em
                padding 5px
        .result
            width 100%
            display flex 
            flex-direction column
            justify-content space-around
            align-items center
            .thumb
                width 60px
                height 60px
                border-radius 50%

</style>
