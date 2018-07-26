<template>
  <div :class="{cart:true, open:active}">
    <!-- <div :class="{'cart-button':true, active:active, adding:adding}" v-if="cartItems.length > 0" @click="active = !active" v-html="!!active ? down : bagIcon">
      {{totalQty}}
    </div> -->
    <i class="icon-shopping-bag">
      <svg :class="{'cart-button':true, active:active, adding:adding}" v-if="cartItems.length > 0 && !active" @click="toggleOn">
        <use xlink:href="#icon-shopping-bag"></use>
      </svg>
      <svg :class="{'cart-button':true, active:active, adding:adding}" v-if="cartItems.length > 0 && !!active" @click="toggleOff" v-html="down" fill="red">
      </svg>
    </i>
    <span class="qty" v-if="cartItems.length > 0 && !active">{{cartItems.length}}</span>
    <div class="exit-box" v-if="active" @click="active = false"></div>
    <div class="cart-container">
      <ul class="cart-list">
        <li v-for="(product,key) in cartItems" :key="key" class="cart-item">
          <img  v-if="!!product.image" :src="product.image.src" class="thumbnail" @click="details(product.id)"/>
          <div v-else class="thumbnail" @click="details(product.id)"></div>
          <div>
            <span class="title">{{product.product.handle}}</span>
            <div class="split">
              <span v-if="product.qty > 1">{{product.qty}}x</span>
              <span>{{product.title}}</span>
            </div>
          </div>
          <span class="price">${{parseInt(product.price)}}</span>
          <i class="icon-remove" @click="removeItem(product.id, key)">
            <svg class="show hidden">
              <use xlink:href="#icon-remove"></use>
            </svg>
          </i>
        </li>
      </ul>
      <div class="details">
        <influencer-code v-if="!couponCode"></influencer-code>
        <div class="subtotal">
          <h4>subtotal : ${{subtotalPrice}}</h4>
          <h5 v-if="couponCode">code: {{couponCode}} 
            <i class="icon-remove" @click="removeCouponCode()">
              <svg>
                <use xlink:href="#icon-remove"></use>
              </svg>
            </i>
          </h5>
          <button v-show="cart" class="checkout" @click="checkout">checkout</button>
        </div>
      </div>
      

      <a class="close-link" @click="influencer = false" v-if="!!influencer">done</a>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import queries from '@/resources/query'
import bagIcon from '@/assets/shopping-cart.svg'
import down from '@/assets/down.svg'
import Events from './Bus.js'
import InfluencerCode from './InfluencerCode.vue';


export default {
  name: 'Cart',
  components : {InfluencerCode},
  data () {
    return {
      cartItems : [],
      cart: null,
      bagIcon: bagIcon,
      adding: false,
      userId: null,
      newCode: false,
      influencer: false,
      down
    }
  },
  computed : {
    active(){
      return this.$route.hash === "#cart" && this.cartItems.length > 0
    },
    itemList(){
      if(!!this.cart){
        return this.cart.checkout.lineItems.edges.map( e => e.node )
      }else{
        return false
      }
    },
    couponCode(){
      if(!!this.newCode){

        let coupon = JSON.stringify(this.newCode)
        localStorage.coupon = coupon
        return this.newCode.code

      }else if(!!localStorage.coupon){

        let coupon = JSON.parse(localStorage.coupon)
        if(Date.now() >= coupon.expiration){
          console.log('expired')
        }else{
          return coupon.code
        }
      }else{
        return false
      }
    },
    totalQty(){
      let qty = this.cartItems.map(item => item.qty);
      return qty.reduce((a, b) => a + b, 0)
    },
    subtotalPrice(){
      if(!!this.cartItems){
        let total = 0
        for(let each in this.cartItems){
          console.log(this.cartItems[each].price)
          total += parseInt(this.cartItems[each].price)
        }

        return total
      }
    },
    totalPrice(){
      if(!!this.cart){
        return this.cart.checkout.totalPrice        
      }
    }
  },
  watch :{
    totalQty(nu, old, something){
      console.log(nu,old, something)
      if(nu === 0){
        this.$router.go(-1)
      }
      //else if( old === 0 && nu === 1){
      //   console.log('watch')
      //   this.active = true
      // }
      this.adding = true
      setTimeout(()=>{this.adding = false}, 1500)
    }
  },
  async created(){
    let that = this;
    Events.Bus.$on('userLogin', (userId) => {
      console.log('login', userId);
      that.userId = userId
    })

    Events.Bus.$on('addCouponCode', couponCode => this.addCouponCode(couponCode))
  },
  async mounted(){
    let that = this;
    Events.Bus.$on('addToCart', variant => this.addToCart(variant));
    if(!!localStorage.cart){
      let cart = JSON.parse(localStorage.cart)
      console.log('cart is', cart)
      let existingCart = await this.$apollo.query({
        query: gql(queries.getCart),
        variables: {
          cartID : cart.cartID
        }
      })

      if(!existingCart.data.node.completedAt){
        this.removeCouponCode()
        this.cart = {
          checkout : existingCart.data.node
        }

        this.cartItems = JSON.parse(cart.cartContents)
        
        if(!!this.userId){
          this.associate()
        }
      }else{
        localStorage.removeItem('cart')
      }

      
    }

    if(this.$route.name === 'Partner'){
      console.log(this.$route.params.code)
      Events.Bus.$emit('addCouponCode', this.$route.params.code)
    }

    if(!!this.$route.query.promo){
      console.log(this.$route.query.promo)
      Events.Bus.$emit('addCouponCode', this.$route.query.promo)
    }
      
    
  },
  methods : {
    toggleOn(){
      this.$router.push('#cart')
    },
    toggleOff(){
      this.$router.go(-1)
    },
    addCouponCode(couponCode){

      let date = new Date()
      let nextMonth = date.setMonth(date.getMonth() + 1)
      let nextWeek = date.setDate(date.getDate() + 7)
      let expire

      if(couponCode === 'tryouts'){
        expire = nextWeek
      }else{
        expire = nextMonth
      }
       

      this.newCode = {
        code : couponCode,
        expiration: expire
      }
    },
    removeCouponCode(){
      localStorage.removeItem('coupon');
      this.newCode = false
    },
    async associate(){
      if(!!this.cart && !!this.userId){

        let checkout = this.cart.checkout.id
        let user = this.userId

        let result = await this.$apollo.mutate({
          mutation: gql(queries.associateCheckout),
          variables: {
            checkoutId: checkout,
            customerAccessToken: user
          }
        })

        try{
          this.cart = result.data.checkoutCustomerAssociate
        }catch(err){
          console.log(err)
        }

      }
    },
    async removeItem(product, key){

      this.cartItems.splice(key, 1)
      console.log(this.cartItems)
      console.log('removing variant id: ', product)

      console.log(this.cart.checkout.lineItems.edges)
      let prod =this.cart.checkout.lineItems.edges.find(p => {
        return p.node.variant.id === product
      })

      console.log('cart product matched :', prod)

      let checkout = this.cart.checkout.id

      let result = await this.$apollo.mutate({
        mutation: gql(queries.removeFromCart),
        variables: {
          lineItemIds: [prod.node.id],
          checkout: checkout
        }
      })

      console.log('result of remove: ',result)

      if(!!result.data.checkoutLineItemsRemove.checkout){
        this.cart = result.data.checkoutLineItemsRemove
        localStorage.cart = JSON.stringify({
            cartID: this.cart.checkout.id,
            cartContents: JSON.stringify(this.cartItems)
        })
        console.log('successful remove')
      }
    },
    async addToCart(variant){
      variant = JSON.parse(variant)
      variant.details = false

      let id = variant.id
      let qty = 1
      let existing = this.cartItems.find(item => item.id === variant.id)

      if(this.cartItems.length === 0){
        let result = await this.$apollo.mutate({
          mutation: gql(queries.createCart),
          // Parameters
          variables: {
            variant: id,
            quantity: qty
          }
        })
        if(!!result.data.checkoutCreate.checkout){
          if(!!existing && !existing.qty){
            existing.qty = 2
          }else if(!!existing && existing.qty){
            existing.qty++
          }else if(!existing){
            variant.qty = 1
            this.cartItems.push(variant)
          }
          
          this.cart = result.data.checkoutCreate
          localStorage.cart = JSON.stringify({
            cartID: this.cart.checkout.id,
            cartContents: JSON.stringify(this.cartItems)
          })
          console.log('successful init')
        }
      }else{
        let checkout = this.cart.checkout.id
        console.log('adding to cart')

        let result = await this.$apollo.mutate({
          mutation: gql(queries.addToCart),
          // Parameters
          variables: {
            variant: id,
            quantity: qty,
            checkout: checkout
          }
        })
        console.log(result)

        if(!!result.data.checkoutLineItemsAdd.checkout){
          
          if(!!existing && !existing.qty){
            existing.qty = 2
          }else if(!!existing && !!existing.qty){
            existing.qty++
          }else if(!existing){
            variant.qty = 1
            this.cartItems.push(variant)
          }

          this.cart = result.data.checkoutLineItemsAdd
          localStorage.cart = JSON.stringify({
            cartID: this.cart.checkout.id,
            cartContents: JSON.stringify(this.cartItems)
          })
          console.log('successful add')
        }
      }
    },
    details(product){
      let prod = this.cartItems.find(p => p.id === product)
      prod.details = !!prod.details ? false : true
      return prod
    },
    checkout(){
      let url = this.cart.checkout.webUrl
      if(!!this.couponCode){
        this.$analytics.fbq.event('CheckoutCouponUsed', {
          value : this.couponCode
        });
        url = url + `&discount=${this.couponCode}`
      }
      
      this.$analytics.fbq.event('InitiateCheckout');
      window.location.href = url
    }
  }
}
</script>
<style lang="stylus">
@keyframes add  
    0%
      transform scale(1)
      filter hue-rotate(35deg) brightness(0.8)
    50%
      transform scale(1.2)
      filter hue-rotate(35deg) brightness(1)
    100% 
      transform scale(1)
      filter hue-rotate(35deg) brightness(0.8)
.cart
  background #e9e9e9
  position fixed
  bottom -100%
  left 0
  width 100%
  height 100%
  transition .4s ease
  z-index 5000
  user-select none
  .close-link
    z-index 1000
    position absolute
    bottom 10px
    left 45%
    right 45%
  .exit-box
    position absolute
    top -100%
    left 0
    width 100%
    height 100%
    z-index 1
    background rgba(0,0,0,.7)
    transition .3s ease
  &.open
    bottom 0
  span.qty
    position fixed
    bottom 25px
    right 10px
    z-index 9999999
    color black
    font-size 8px
    font-weight 700
  .cart-button
    border-radius 5px
    position fixed
    bottom 10px
    right 15px
    z-index 1000
    cursor pointer
    transition .4s ease
    width 1.5rem
    height 1.5rem
    padding .25rem
    filter hue-rotate(35deg) brightness(0.8)
    &.adding
      animation add .6s ease;
    img
      width 15px
    .cart-count
      width 100%
      text-align center
      font-weight bold
      font-size 8px
      margin 0
  h1
    margin 5px 0
.cart-container
  flex-direction column
  height 100%
  width 50%
  min-width 600px
  margin 0 auto
  display flex
  justify-content space-between
  @media screen and (max-width 800px)
    width 100%
    min-width 0
.cart-list
  overflow-x scroll
.details
  display flex
  flex-direction column
  flex 1
  justify-content center
  align-items center
  p
    margin 0
  .checkout
    background #8084aa
    border none
    border-radius 5px
    padding 10px
    width 90%
    color white
  .subtotal
    width 100%
    padding 10%
    box-sizing border-box
    display flex
    flex-direction column
    align-items center
    h5
      position relative
      width auto
      .icon-remove
        position absolute
        top -.5rem
        right -1rem
        svg
          height .5rem
          width .5rem
          padding .5rem
    h4,h5
      margin 10px 0

.cart-list
  display flex
  flex-direction column
  padding 10px
  height 50%
  box-sizing border-box
  overflow-y scroll
  .cart-item
    position relative
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    background #f2f2f2
    border-radius 5px
    box-sizing border-box
    .hidden
      display none
      &.show
        display block
        position absolute
        top 5px
        right 5px
        width 10px
        height 10px
        cursor pointer
        border-radius 50%
        color white
        font-size 8px
        font-weight 900
        filter brightness(0.7)
        &.executing
          opacity 1
          background #512A28 !important
          .progress-bar
            opacity 1
            background rgba(0,0,0,.5)
        .progress-bar
          top 0
          bottom initial
          opacity 1
          height 100%
          background rgba(0,0,0,.5)
          border-radius 5px
    .title
      margin 5px 0
      font-size 12px
    img, div.thumbnail
      width auto
      height 100%
      max-height 80px
      cursor pointer
      border-radius 5px
    div.thumbnail
      width 100%
    .split
      display flex
      justify-content space-between
      span
        font-size 10px
    span.price
      font-size 10px
      text-align right
</style>

