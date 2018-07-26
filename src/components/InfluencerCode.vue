<template>
    <div class="influencer-box">
        <div class="influencer-field-group" v-if="!igMatch.profile">
            <a @click="influencer = true" v-if="!influencer">have a code?</a>
            <a v-if="influencer">{{influencerCode.length > 0 ? 'searching...' : 'enter your code'}}</a>
            <input type="text"  class="required" v-model="influencerCode" v-if="influencer">
        </div>
        <div class="result" v-if="!!igMatch.profile">
            <div>
                <div class="thumb">
                    <img :src="igMatch.profile" />
                </div>
            </div>
            <div>
                <h3>@{{igMatch.username}}</h3>
                <button v-if="!applied" @click="applyCode">apply this code</button>
                <button v-else disabled class="applied">code applied!</button>
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
                console.log(user)
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
        width 100%
        padding 5% 10%
        display flex
        flex-direction row
        justify-content center
        align-items center
        background #f2f2f2
        box-sizing border-box
        .influencer-field-group
            text-align left
            transition .3s ease
            width 90%
            a
                margin 5px 0
                width 100%
                font-weight 600
                font-size .8em
            input
                font-size .7em
                width 100%
                padding 5px 0
                transition .3s ease
        .result
            display flex 
            justify-content space-around
            align-items center
            padding 5% 10%
            width 100%
            div
                width 100%
                h3
                    font-size .55em
                button
                    background #5bc581
                    border none
                    border-radius 5px
                    padding 10px
                    width 90%
                    color white
                    &.applied
                        background gray
                        cursor initial
            .thumb
                margin 0 auto
                width 40px
                height 40px
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
