<template>
  <div class="min-h-screen flex flex-col bg-slate-50 font-sans">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Left side: Links -->
          <div class="flex items-center space-x-8">
            <router-link 
              to="/" 
              class="text-sm font-medium transition-colors relative py-5"
              :class="$route.path === '/' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'"
            >
              Home
              <div v-if="$route.path === '/'" class="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>
            </router-link>
            
            <template v-if="authStore.isAuthenticated">
              <router-link 
                to="/my-projects" 
                class="text-sm font-medium transition-colors relative py-5"
                :class="$route.path === '/my-projects' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'"
              >
                My Projects
                <div v-if="$route.path === '/my-projects'" class="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>
              </router-link>
            </template>
          </div>

          <!-- Right side: Notifications & Profile or Auth Links -->
          <div class="flex items-center space-x-6">
            <template v-if="authStore.isAuthenticated">
              <!-- Notification Bell -->
              <router-link to="/notifications" class="text-slate-500 hover:text-primary transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                <!-- Badge (Optional, can be bound to real data later) -->
                <!-- <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger ring-2 ring-white"></span> -->
              </router-link>

              <!-- Profile Dropdown -->
              <div class="relative" ref="profileDropdownRef">
                <button @click="isDropdownOpen = !isDropdownOpen" class="flex items-center space-x-2 focus:outline-none">
                  <div class="w-8 h-8 rounded-full border border-primary/30 text-primary flex items-center justify-center font-semibold text-sm bg-indigo-50">
                    {{ userInitials }}
                  </div>
                  <span class="text-sm font-medium text-slate-700">{{ authStore.user?.name || 'Member' }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-2 z-50">
                    <div class="px-4 py-3 border-b border-slate-100">
                      <p class="text-sm font-semibold text-slate-800">{{ authStore.user?.name || 'Member User' }}</p>
                      <p class="text-xs font-medium text-slate-500 truncate">{{ authStore.user?.email || 'member@collabhub.com' }}</p>
                    </div>
                    
                    <router-link to="/edit-profile" @click="isDropdownOpen = false" class="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 text-slate-400">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Edit Profile
                    </router-link>
                    
                    <button @click="logout" class="w-full flex items-center px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                </transition>
              </div>
            </template>
            <template v-else>
              <router-link to="/login" class="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Login</router-link>
              <router-link to="/register" class="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">Sign Up</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-8 text-center mt-auto">
      <p class="text-slate-500 text-sm font-medium">© {{ new Date().getFullYear() }} CollabHub. Professional Collaboration Platform.</p>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from './store/auth'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isDropdownOpen = ref(false)
const profileDropdownRef = ref(null)

const userInitials = computed(() => {
  if (authStore.user?.name) {
    const names = authStore.user.name.split(' ')
    if (names.length > 1) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return names[0].substring(0, 2).toUpperCase()
  }
  return 'MU'
})

const logout = async () => {
  isDropdownOpen.value = false
  await authStore.logout()
  router.push('/login')
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchUser()
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
