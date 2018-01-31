// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import VueApollo from 'vue-apollo'
import VueFacebookPixel from 'vue-analytics-facebook-pixel'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-103381676-2',
  router,
  ecommerce: {
    enabled: true,
    enhanced: true
  }
})

Vue.use(VueFacebookPixel)

Vue.config.productionTip = false

// ----- APOLLO
const networkInterface = createNetworkInterface({
    uri: 'https://koa-nyc.myshopify.com/api/graphql',
    //uri: 'https://async-nyc.myshopify.com/api/graphql',
    connectToDevTools: true,
})


  
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    req.options.headers['X-Shopify-Storefront-Access-Token'] = 'eb096637a3936219e054f4424183515e';
    //req.options.headers['X-Shopify-Storefront-Access-Token'] = '1ec799ac42086d67fbe44612445d3329';
    next();
  }
}]);

const apolloClient = new ApolloClient({networkInterface})


const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.use(VueApollo)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  apolloProvider,
  template: '<App/>',
  components: { App }
})