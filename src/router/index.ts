import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView
    },
    {
      path: '/price-monitor',
      name: 'price-monitor',
      component: () => import('../views/PriceMonitor.vue')
    }
  ]
})

export default router
