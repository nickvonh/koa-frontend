<template>
  <div :class="{cart:true, open:active}">
    <div :class="{'cart-button':true, active:active, adding:adding}" v-if="cartItems.length > 0" @click="active = !active" >
      <img :src="bagIcon"/>
      <p class="cart-count">{{totalQty}}</p>
    </div>
    <div class="exit-box" v-if="active" @click="active = false"></div>
    <div class="cart-container">
      <ul class="cart-list">
        <li v-for="(product,key) in cartItems" :key="key" class="cart-item">
          <span class="title">{{product.product.handle}}</span>
          <img  v-if="!!product.image" :src="product.image.src" class="thumbnail" @click="details(product.id)"/>
          <div v-else class="thumbnail" @click="details(product.id)"></div>
          <div class="split">
            <span v-if="product.qty > 1">{{product.qty}}x</span>
            <span>{{product.title}}</span>
            <span>{{product.price}}</span>
          </div>
          <long-press duration=".6" pressing-text="removing..." action-text="removing.." :on-confirm="removeItem" :value="product.id" class="show  hidden" v-if="product.details">hold to remove</long-press>
        </li>
      </ul>
      <div class="details">
        <h4>subtotal : ${{subtotalPrice}}</h4>
        <h5 v-if="couponCode">code: {{couponCode}}</h5>
        <button v-show="cart" class="checkout" @click="checkout">checkout</button>
      </div>
    </div>
    <user></user>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import queries from '@/resources/query'
import bagIcon from '@/assets/bag.png'
import Events from './Bus.js'
import LongPress from './LongPress';
import User from './User'


export default {
  name: 'Cart',
  components : {LongPress, User},
  data () {
    return {
      cartItems : [],
      cart: null,
      bagIcon: bagIcon,
      active: false,
      adding: false,
      userId: null,
      newCode: false
    }
  },
  computed : {
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
    totalQty(nu, old){
      if(nu === 0){
        this.active = false
      }else if( old === 0 && nu === 1){
        this.active = true
      }
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
      let code = this.$route.path.match(/\/(.*)/)[1]
      console.log(code)
      Events.Bus.$emit('addCouponCode', code)
    }
      
    
  },
  methods : {
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
    async removeItem(product){
      let prod = this.itemList.find((p) => p.variant.id === product)
      let index = this.cartItems.indexOf(prod)
      let checkout = this.cart.checkout.id

      this.cartItems.splice(index)
      console.log(this.cartItems)

      let result = await this.$apollo.mutate({
        mutation: gql(queries.removeFromCart),
        variables: {
          lineItemIds: [prod.id],
          checkout: checkout
        }
      })

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
        this.removeCouponCode()
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
      filter brightness(1)
    50%
      transform scale(1.2)
      filter brightness(1.6)
    100% 
      transform scale(1)
      filter brightness(1)
.cart
  background #e9e9e9
  padding 10px 0
  position fixed
  bottom -100%
  left 0
  width 100%
  height 60%
  transition .4s ease
  z-index 999999
  user-select none
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
  .cart-button
    position fixed
    top initial
    right 30px
    bottom 30px
    background #8084aa
    border-radius 50%
    width 30px
    height 30px
    padding 10px
    z-index 9999999999999999
    cursor pointer
    transition .4s ease
    box-shadow 0px 1px 3px 3px rgba(100,100,150,.3)
    &:hover
      box-shadow 0px 2px 3px 2px rgba(100,100,150,.6)
      background #6c73b7
    &.active
      background #3c73b7
      bottom 60%
    &.adding
      animation add .6s ease;
    img
      max-width 100%
      filter invert(1)
    .cart-count
      position absolute
      top 7px
      left 0px
      width 100%
      text-align center
      color white
      font-weight bold
      font-size 14px
  @media screen and (max-width 800px)
    .cart-button
      top initial 
      bottom 30px
      &.active
        bottom 60%
  h1
    margin 5px 0

.cart-container
  height 100%
  width 100%
  display flex
  flex-direction row
  justify-content space-between
@media screen and (max-width 800px)
  .cart-container
    flex-direction column
  .cart-list
    overflow-x scroll
    height 65%
.details
  height 100%
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

.cart-list
  flex 3
  display flex
  flex-direction row
  height 85%
  .cart-item
    position relative
    display flex
    flex-direction column
    flex none
    height 100%
    justify-content flex-start
    .hidden
      display none
      &.show
        display block
        position absolute
        top 50%
        left 10%
        width 80%
        right 10%
        cursor pointer
        background lighten(#512A28,30%)
        border-radius 5px
        padding-top 15px
        padding-bottom 15px
        color white
        font-size 12px
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
      font-size 16px
    img, div.thumbnail
      height 100%
      max-height 200px
      cursor pointer
      margin 0 auto
    div.thumbnail
      width 100%
    .split
      display flex
      justify-content space-between
      margin 5px 0
      span
        font-size 12px
</style>

