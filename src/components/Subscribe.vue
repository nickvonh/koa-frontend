<template>
    <div :class="{subscribe:true, open:active}" v-show="!existingCoupon">
        <div :class="{'subscribe-button':true, active:active, registered:success}"  @click="activate" ref="button">{{discount}}% off</div>
        <div class="exit-box" v-if="active" @click="active = false"></div>
        <div id="mc_embed_signup" v-if="!success">
            <form v-if="!influencer" action="https://myshopify.us16.list-manage.com/subscribe/post?u=5bffb9f9f9a55bc2c12b51cf6&amp;id=0ad7356836" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
                <div id="mc_embed_signup_scroll">
                <h2>Stay in touch!</h2>
                <h5>Sign up for early access to new collections and special offers<br>+ 15% off your first purchase </h5>
            <div class="mc-field-group">
                <label for="mce-EMAIL">Email Address </label>
                <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
            </div>
                <div id="mce-responses" class="clear">
                <div class="response" id="mce-error-response" style="display:none"></div>
                <div class="response" id="mce-success-response" style="display:none"></div>
                </div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_5bffb9f9f9a55bc2c12b51cf6_0ad7356836" tabindex="-1" value=""></div>
                <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
                </div>
            </form>
            <div class="influencer-box" v-else>
                <div class="influencer-field-group" v-if="!applied">
                    <h2>Referal code</h2>
                    <h5>Input your code here and we'll match it!</h5>
                    <input type="text"  class="required email" v-model="influencerCode">
                </div>
                <div class="result" v-if="!!igMatch.user">
                    <div>
                        <div class="thumb">
                            <img :src="igMatch.user.user.profile_pic_url_hd" />
                        </div>
                    </div>
                    <div>
                        <h3>@{{igMatch.user.user.username}}</h3>
                        <button v-if="!applied"@click="applyCode">Apply this code</button>
                        <button v-else disabled class="applied">Code Applied!</button>
                    </div>
                </div>
            </div>
            <a class="influencer-link" @click="influencer = true" v-if="!influencer">apply an influencer code.</a>
            <a class="subscribe-link" @click="influencer = false" v-else>subscribe to newsletter.</a>
        </div>
        <div v-else>
            <p>Thanks for singing up!</p>
            <h3>code : tryouts</h3>
            <p>will be automatically applied at checkout</p>
        </div>
    </div>
</template>
<script>
import Events from './Bus.js'
import influencers from '@/resources/influencers.json'
import axios from 'axios'

export default {
    name : 'subscribe',
    data (){
        return {
            existingCoupon: false,
            active: false,
            success: false,
            triggered: false,
            influencerList: influencers,
            influencer: false,
            influencerCode: '',
            igMatch: {
                user: false,
                code: false
            },
            discount: 15,
            applied: false
        }
    },
    methods : {
        activate(){
            if(!this.triggered){
                this.$analytics.fbq.event('20 Off Button')
                this.triggered = true
            }

            this.active = !this.active
        },
        applyCode(){
            let code = this.igMatch.code
            if(!!code){
                Events.Bus.$emit('addCouponCode', code)
                this.applied = true
                localStorage.subscribed = 'true'
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
                let user = await axios.get(`https://www.instagram.com/${influencer.ig}/?__a=1`)
                if(!!user){
                    this.igMatch = {
                        code: influencer.code,
                        user: user.data
                    }
                    this.discount = 20
                }
                
            }
        }
    },
    mounted(){
        let that = this

        if(this.$route.name === 'Partner' || !!localStorage.coupon || !!localStorage.subscribed){
            this.existingCoupon = true
        }

        document.addEventListener('reset', (event) => {
            let success = document.getElementById('mce-success-response').style.display === 'block'

            this.success = success

            if(!!success){
                let email = document.getElementById('mce-EMAIL').value
                this.$analytics.fbq.event('CompleteRegistration', {
                    value : email
                })
                Events.Bus.$emit('addCouponCode', 'tryouts')
                localStorage.subscribed = 'true'
            }
        })
    }
}
</script>
<style lang="stylus">
#mc_embed_signup
    background #fff
    clear left
    font-size 14px
    max-width 800px
    margin 0 auto
    height 80%
    form
        padding 0
.subscribe
    background white
    position fixed
    bottom -100%
    left 0
    width 100%
    height 270px
    transition .4s ease
    z-index 999998
    user-select none
    padding-left 5px
    h5
        margin 0
    a
        cursor pointer
    .exit-box
        position absolute
        top -100vh
        left 0
        width 100%
        height 100vh
        z-index 1
        background rgba(0,0,0,.7)
        transition .3s ease
    &.open
        bottom 0
.subscribe-button
    position fixed
    top initial
    right 30px
    bottom 90px
    background #56a79f
    border-radius 50%
    width 30px
    height 30px
    padding 10px
    display flex
    justify-content center
    align-items center
    z-index 9999999999999998
    cursor pointer
    transition .4s ease
    box-shadow 0px 1px 3px 3px rgba(100,100,150,.3)
    color white
    font-weight 900
    font-size .8em
    animation-name pulse
    animation-duration 6s
    animation-iteration-count infinite
    &.active
        bottom 250px
        animation none
    &.registered
        animation none
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

@media screen and (min-width: 800px)
    .subscribe
        background rgba(0,0,0,0.7)
        position fixed
        bottom -100%
        left 0
        width 100%
        height 270px
        transition .4s ease
        z-index 999998
        user-select none
        padding-left 5px
        #mc_embed_signup
            position absolute
            bottom 5px
            right 0
            background #fff
            font-size 14px
            width 600px
            height 80%
            padding 30px
            z-index 2
            form
                padding 0

@keyframes pulse
    0
        transform scale(1)
    80%
        transform scale(1)
    85%
        transform scale(1.1)
    90%
        transform scale(1)
    95%
        transform scale(1.1)
    100%
        transform scale(1)

</style>
