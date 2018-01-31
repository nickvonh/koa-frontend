<template>
    <div class="user">
        <div class="login" v-if="!user">
            <div class="input-box">
                <input type="email" name="email" placeholder="email" v-model="email"/>
                <input type="password" name="password" placeholder="password" v-model="password"/>
            </div>
            <button @click="signin">sign in</button>
        </div>
        <div v-else>
        </div>
    </div>
</template>
<script>
import queries from '@/resources/query'
import gql from 'graphql-tag'
import Events from './Bus.js'
export default {
    name : 'user',
    data () {
        let token = null;

        if(!!localStorage.customerToken){
            token = JSON.parse(localStorage.customerToken)
            let exp = new Date(token.customerAccessTokenCreate.customerAccessToken.expiresAt)
            let access = token.customerAccessTokenCreate.customerAccessToken.accessToken
            console.log(exp)
            if (Date.now() > exp){
                console.log('expired')
                localStorage.removeItem(customerToken)
                token = null
            }else{
                console.log(access)
                Events.Bus.$emit('userLogin', access)
            }
        }

        return {
            email : null,
            password : null,
            customerToken : token
        }
    },
    apollo : {
        user : {
            query: gql(queries.getCustomer),
            variables() {
                return {
                    token: this.token.accessToken
                }
            },
            update: (user) => {
                return user.customer
            },
            skip() {
                if(!this.token){
                    return this.skipQuery
                }else{
                    return false
                }
            }
        }         
    },
    computed : {
        token(){
            if(!!this.customerToken){
                localStorage.customerToken = JSON.stringify(this.customerToken)
                return this.customerToken.customerAccessTokenCreate.customerAccessToken
            }
        }
    },
    methods:{
        async signin(){

            let result = await this.$apollo.mutate({
                mutation: gql(queries.createCustomerToken),
                variables: {
                    email: this.email,
                    pw: this.password
                }
            })

            try{
                let token = result.data.customerAccessTokenCreate.customerAccessToken.accessToken

                this.customerToken = result.data;
                this.email = null;
                this.password = null;

                console.log(token)
                Events.Bus.$emit('userLogin', token)

                console.log('signed in')
            }catch(err){
                console.log(err)
            }
        }
    }
}
</script>
<style lang="stylus">
.login
    width 100%
    padding 10px 0
    .input-box
        width 100%
        max-width 500px
        display flex
        justify-content space-around
        margin-bottom 10px
        input
            border black 1px solid
    button
        background #8084aa
        border none 
        border-radius 5px
        color white
        padding 5px 10px
        margin 10px 0
</style>
