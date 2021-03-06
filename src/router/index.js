import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import LoginHistory from '../views/LoginHistory.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: 'user',
    children: [
      {
        path: 'user',
        name: 'user',
        component: User,
      },
      {
        path: 'loginHistory',
        name: 'loginHistory',
        component: LoginHistory,
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
