import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import About from '@/components/About'
import Fabrics from '@/components/Fabrics'
import FabricProfile from '@/components/FabricProfile'
import ProdLoop from '@/components/ProductLoop'
import Product from '@/components/Product'
import FullGallery from '@/components/Gallery'
import Returns from '@/components/Returns'

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
      path: '/',
      name: 'Home',
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
              name: 'Full-Gallery',
              props: true,
              component: FullGallery
            }
          ]
        }
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
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/fabrics',
      name: 'Fabrics',
      component: Fabrics
    },
    {
      path: '/fabrics/:fabricName',
      name: 'Fabric-Profile',
      component: FabricProfile
    },
    {
      path: '/returns',
      name: 'Returns',
      component: Returns
    },
    {
      path: '/yfw',
      name: 'Partner',
      component: Home
    },
    {
      path: '/EMILYAMBER',
      name: 'Partner',
      component: Home
    },
    {
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
    }
  ]
})
