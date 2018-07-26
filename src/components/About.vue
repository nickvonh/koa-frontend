<template>
   <div class="about">
       <div class="head">
           <h3>Our Core</h3>
           <p>
               We create technical activewear that bleeds into your <strong>daily</strong> wardrobe.<br/>
               – clothing that are timeless, versatile and long lasting.<br/>
               <br/>
               <strong>We stress quality <em>a lot</em>, and here's what that means to us.</strong>
           </p>
       </div>
       
       <div class="chunks">
           <div class="chunk">
               <h3>Details are in the Fabric</h3> <a @click="goFabrics">learn more</a>
               <p>
                   Curated for their technical attributes – our materials provide optimal functionality and sleek form.<br/><br/>
                   Everything starts with these building blocks.
               </p>
           </div>

           <div class="chunk">
               <h3>Less is More</h3>
               <p>
                   By releasing small <strong>capsule groups</strong> we can focus on <em>perfecting</em> our staple pieces.<br/><br/>
                   This translates to higher quality, <strong>less waste</strong> and a more sustainable process – which we believe is every brand's responsibility.
               </p>
           </div>

           <div class="chunk">
               <h3>Bringing it Home</h3>
               <p>
                   We developed an <strong>in-house sampling process</strong>. This allows us to monitor the quality closely, at every step of the way.<br/><br/>
                   The ability to iterate on the spot allows us to perfect the fit of our products, in a more efficient manner.
               </p>
           </div>
       </div>
       <div class="foot">
           <h3>What Keeps us Going</h3>
           <p>
                As a brand, we want to contribute by connecting a community that celebrates conscious living, constant improvement and the will to never stop moving forward.<br/><br/>
                We take these values and apply it to all that we do, from our material sourcing to design. <br/><br/><em>Improving is moving forward.</em>
           </p>
        </div>
   </div>
</template>
<script>
export default {
    name : 'about',
    data () {
        return {
        }
    },
    methods : {
        goFabrics(){
            this.$router.push({name:'Fabrics'})
        }
    }
}
</script>
<style lang="stylus">
.about
    display flex
    flex-direction column
    max-width 600px
    margin 0 auto
    text-align left
    .chunks
        width 90%
        margin 0 auto 
        padding 0
        box-sizing border-box
        .chunk
            padding 20px
            background #f9f9f9
            border-radius 5px
            margin-bottom 10px
            position relative
            a
                position absolute
                top 20px
                right 20px
                font-size .6em
                font-weight 500
                text-decoration underline
                cursor pointer
            h3
                color #7f8af5
                margin 0
                font-size 1.1em
                font-weight 600
            p
                font-size .9rem
                line-height 1.7em
                font-weight 400
    .head, .foot
        margin 5px 25px
        h3
            font-size 2em
            font-weight 600
            color #7f8af5
            margin 10px 0
        p
            font-size 1rem
            line-height 1.7em
    .foot
        margin 25px
</style>
