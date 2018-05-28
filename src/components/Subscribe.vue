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
            <influencer-code v-else></influencer-code>
            <a class="influencer-link" @click="influencer = true" v-if="!influencer">already have a code?</a>
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
import InfluencerCode from './InfluencerCode.vue'

export default {
    name : 'subscribe',
    components : {InfluencerCode},
    data (){
        return {
            existingCoupon: false,
            active: false,
            success: false,
            triggered: false,
            discount: 15,
            applied: false,
            influencer: false
        }
    },
    methods : {
        activate(){
            if(!this.triggered){
                this.$analytics.fbq.event('20 Off Button')
                this.triggered = true
            }

            this.active = !this.active
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

        document.addEventListener('checkCoupon', (event) => {
            console.log('checkCoupon')
            if(this.$route.name === 'Partner' || !!localStorage.coupon || !!localStorage.subscribed){
                this.existingCoupon = true
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
