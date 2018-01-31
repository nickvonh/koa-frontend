<template>
    <div class="message-bar">
        <span v-html="message"></span>
        <div :class="{popup:true, active:active}">
            <div class="exit-box" v-if="active" @click="active = false"></div>
            <div class="popup-content">
                <img :src="exitIcon" class="exit" @click="active = false"/>
                <h1>Cyberweek Sale</h1>
                <h2>Enjoy <strong>20% OFF</strong> across the site</h2>
                <p><em>Hurry! Promo ends in</em></p>
                <p class="timer" v-if="!!timer"><strong>{{timer}}</strong></p>
                <button @click="shop" class="cta">shop now</button>
            </div>
        </div>
    </div>
</template>
<script>
import exit from '@/assets/exit.svg'
export default {
    name : 'message-bar',
    mounted(){
        const that = this;
        setInterval(()=>{
            if(this.key < this.messages.length-1){
                this.key++
            }else{
                this.key = 0
            }
        }, 3600)

        const countDownDate = new Date("Dec 1, 2017 23:59:59").getTime();

        // Update the count down every 1 second
        const countInterval = setInterval(function() {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            that.timer = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

            // If the count down is finished, write some text 
            if (distance < 0) {
                clearInterval(countInterval);
                that.active = false
            }
        }, 1000);
    },
    data () {
        return {
            messages : [
                'free shipping on orders over $75'
            ],
            key : 0,
            active : false,
            exitIcon: exit,
            timer: false
        }
    },
    computed:{
        message(){
            return this.messages[this.key]
        }
    },
    methods : {
        shop(){
            this.$analytics.fbq.event('CyberWeekShopNowClicked')
            this.active = false;
            this.$router.push({name:'Collection', params:{collection:'all'}})
        }
    }
}
</script>
<style lang="stylus">
    .message-bar
        color white
        background #636363
        font-size .9em
        p
            margin 1px
        .popup
            position fixed
            bottom 0
            left 0
            width 100%
            height 100%
            transition .4s ease
            z-index 999998
            user-select none
            display none
            &.active
                display block
            .exit-box
                position absolute
                top 0
                left 0
                width 100%
                height 100vh
                z-index 1
                background rgba(0,0,0,.7)
                transition .3s ease
            .popup-content
                position absolute
                bottom calc(100vh - 445px)
                left 7.5%
                right 7.5%
                width 85%
                height 270px
                background white
                z-index 999999
                color black
                .exit
                    height 10px
                    position absolute
                    right 5px
                    top 5px
                .cta
                    font-size .8em
                    font-weight 600
                    background-size 400% 400%
                    background #8084aa;
                    animation shop 4s ease infinite
                    width 100px
                    height 40px
                    border none
                    border-radius 4px
                    color white
                    cursor pointer
                    margin 30px 0
                .timer
                    color #ff6a6a
</style>
