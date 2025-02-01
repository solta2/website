import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ListingHomeView from '../views/ListingHomeView.vue'
import ListingView from '../views/ListingView.vue'

import TokensCreateView from '../views/tokens/CreateView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/tokens/create',
    name: 'tokens-create',
    component: TokensCreateView
  },

  {
    path: '/listing-home',
    name: 'listing-home',
    component: ListingHomeView
  },
  {
    path: '/listing',
    name: 'listing',
    component: ListingView
  },
  {
    path: '/about',
    name: 'about',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
