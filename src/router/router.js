import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignUpView.vue')
  },
  {
    path: '/call',
    name: 'call',
    component: () => import('../components/CallPopUp.vue')
  },
  {
    path: '/receive',
    name: 'receive',
    component: () => import('../components/ReceivePopUp.vue')
  },
  
  {
    path: '/:pathMatch(.*)*',
    name: 'error',
    component: () => import('../views/BrokenLink.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard để kiểm tra `accessToken`
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (!requiresAuth) {
    next()
    return
  }

  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) {
    // No access token, redirect to login
    next('/login')
    return
  }

  const decodedToken = jwtDecode(accessToken)
  const currentTime = Date.now() / 1000

  if (decodedToken.exp < currentTime) {
    // Token has expired, try to refresh it
    try {
      const response = await axios.post('/api/token/refresh', {
        refreshToken: localStorage.getItem('refreshToken')
      })

      localStorage.setItem('accessToken', response.data.accessToken)
      next() // proceed to the route as token is now refreshed
    } catch (error) {
      console.error('Error refreshing token:', error)
      next('/login')
    }
  } else {
    // Token is valid, proceed
    next()
  }
})

export default router
