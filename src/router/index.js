import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import IdeaDetail from '../views/IdeaDetail.vue'
import MyProjects from '../views/MyProjects.vue'
import Notification from '../views/Notification.vue'
import EditProfile from '../views/EditProfile.vue'
import CreateIdea from '../views/CreateIdea.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/idea/:id',
    name: 'IdeaDetail',
    component: IdeaDetail
  },
  {
    path: '/my-projects',
    name: 'MyProjects',
    component: MyProjects,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notification,
    meta: { requiresAuth: true }
  },
  {
    path: '/requests',
    name: 'Requests',
    component: Notification,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-idea',
    name: 'CreateIdea',
    component: CreateIdea,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-idea/:id',
    name: 'EditIdea',
    component: CreateIdea,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-profile',
    name: 'EditProfile',
    component: EditProfile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
