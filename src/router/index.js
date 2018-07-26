import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import About from '@/components/About'
import Blog from '@/components/Blog'
import Fabrics from '@/components/Fabrics'
import FabricProfile from '@/components/FabricProfile'
import ProdLoop from '@/components/ProductLoop'
import Product from '@/components/Product'
import ProductAlpha from '@/components/ProductAlpha'
import FullGallery from '@/components/Gallery'
import Returns from '@/components/Returns'
import Influencers from '@/resources/influencers.json'

let codes = Influencers.map(each => {
  return each.code
})


Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    if(from.name !== to.name){
      return { x: 0, y: 0 }      
    }
  },
  mode : 'history',
  routes: [
    {
      path: '/:query?',
      name: 'Home',
      beforeEnter(to, from, next){
        let regex = new RegExp(`"${to.params.query}"`)
        let match = regex.test(JSON.stringify(codes))
        console.log(regex)
        if(!!match){
          console.log(to.params.query)
          next({name:'Partner', params:{code:to.params.query}})
        }else{
          if(to.params.query === 'blog'){
            console.log('loading blog')
            next({name:'Blog'})
          }else{
            console.log('no match')
            next();
          }
        }
      },
      component: Home
    },
    {
      path: '/shop/:collection',
      name: 'Collection',
      props: true,
      component: ProdLoop,
      children: [
        {
          path: ':product',
          name: 'Product',
          props: true,
          component: ProductAlpha
        },
        {
          path: ':product/:color',
          name: 'Product-Color',
          props: true,
          component: ProductAlpha,
          
        }
        // {
        //   path: ':product/:color/v2',
        //   name: 'Product-Alpha',
        //   props: true,
        //   component: ProductAlpha,
        //   children: [
        //     {
        //       path: 'gallery/:index',
        //       name: 'Full-Gallery',
        //       props: true,
        //       component: FullGallery
        //     }
        //   ]
        // }
      ]
    },
    {
      path: '/group/:group',
      name: 'Group',
      props: true,
      component: ProdLoop,
      children: [
        {
          path: ':product',
          name: 'Product',
          props: true,
          component: Product
        },
        {
          path: ':product/:color',
          name: 'Product-Color',
          props: true,
          component: Product,
          children: [
            {
              path: 'gallery',
              name: 'Group-Gallery',
              props: true,
              component: FullGallery
            }
          ]
        }
      ]
    },
    {
      path: '/blog',
      name: 'Blog',
      component: Blog
    },
    {
      path: '/about/us',
      name: 'About',
      component: About
    },
    {
      path: '/about/fabrics',
      name: 'Fabrics',
      component: Fabrics
    },
    {
      path: '/about/fabrics/:fabricName',
      name: 'Fabric-Profile',
      component: FabricProfile
    },
    {
      path: '/about/returns',
      name: 'Returns',
      component: Returns
    },
    {
      path: '/partners/:code',
      name: 'Partner',
      component: Home
    },
    /*{
      path: '/juli20',
      name: 'Partner',
      component: Home
    },
    {
      path: '/erinmurr',
      name: 'Partner',
      component: Home
    },
    {
      path: '/DANRAD',
      name: 'Partner',
      component: Home
    },
    {
      path: '/amyhelfrich',
      name: 'Partner',
      component: Home
    },
    {
      path: '/andibaby10',
      name: 'Partner',
      component: Home
    },
    {
      path: '/stephybaby',
      name: 'Partner',
      component: Home
    },
    {
      path: '/serenana15',
      name: 'Partner',
      component: Home
    },
    {
      path: '/YTW15',
      name: 'Partner',
      component: Home
    },
    {
      path: '/sarah15',
      name: 'Partner',
      component: Home
    },
    {
      path: '/alleeyogi',
      name: 'Partner',
      component: Home
    },
    {
      path: '/sydneylove',
      name : 'Partner',
      component: Home
    },
    {
      path: '/readystephgo',
      name : 'Partner',
      component: Home
    }*/
  ]
})
