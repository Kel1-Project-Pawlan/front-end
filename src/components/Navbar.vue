<template>
  <nav class="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
    <div class="relative mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex h-full items-center">
        <router-link
          to="/"
          class="flex h-full items-center text-xl font-extrabold tracking-tight text-primary transition-colors hover:text-primaryHover"
          @click="closeMenus"
        >
          Kolabora
        </router-link>
      </div>

      <div class="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-7 md:flex">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="relative flex h-full items-center whitespace-nowrap text-sm font-semibold transition-colors"
          :class="isActive(item.to) ? 'text-primary' : 'text-slate-600 hover:text-slate-950'"
        >
          {{ item.label }}
          <span
            v-if="isActive(item.to)"
            class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary"
          ></span>
        </router-link>
      </div>

      <div class="hidden items-center gap-3 md:flex">
        <router-link
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary"
        >
          Login
        </router-link>

        <router-link
          :to="ctaLink.to"
          class="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primaryHover hover:shadow-md hover:shadow-primary/30 active:scale-95"
        >
          {{ ctaLink.label }}
        </router-link>

        <div v-if="authStore.isAuthenticated" ref="profileDropdownRef" class="relative">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary/30 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/10"
            :aria-expanded="isProfileMenuOpen"
            @click="isProfileMenuOpen = !isProfileMenuOpen"
          >
            <span class="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
              {{ userInitials }}
            </span>
            <span class="max-w-28 truncate">{{ authStore.user?.name || 'Member' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="translate-y-1 opacity-0 scale-95"
            enter-to-class="translate-y-0 opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="translate-y-0 opacity-100 scale-100"
            leave-to-class="translate-y-1 opacity-0 scale-95"
          >
            <div
              v-if="isProfileMenuOpen"
              class="absolute right-0 mt-2 w-60 origin-top-right rounded-xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/10"
            >
              <div class="border-b border-slate-100 px-4 py-3">
                <p class="truncate text-sm font-bold text-slate-900">{{ authStore.user?.name || 'Member User' }}</p>
                <p class="truncate text-xs font-medium text-slate-500">{{ authStore.user?.email || 'member@kolabora.test' }}</p>
              </div>

              <router-link
                to="/edit-profile"
                class="mt-1 flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
                @click="closeMenus"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Edit Profile
              </router-link>

              <button
                type="button"
                class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-red-50"
                @click="logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16 17 5-5-5-5" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12H9" />
                </svg>
                Logout
              </button>
            </div>
          </transition>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary md:hidden"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Toggle navigation menu"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div v-if="isMobileMenuOpen" class="border-t border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden">
        <div class="flex flex-col gap-1">
          <router-link
            v-for="item in mobileItems"
            :key="item.to"
            :to="item.to"
            class="rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors"
            :class="isActive(item.to) ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'"
            @click="closeMenus"
          >
            {{ item.label }}
          </router-link>

          <router-link
            :to="ctaLink.to"
            class="mt-2 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primaryHover"
            @click="closeMenus"
          >
            {{ ctaLink.label }}
          </router-link>

          <div v-if="authStore.isAuthenticated" class="mt-3 border-t border-slate-100 pt-3">
            <div class="px-3 pb-2">
              <p class="truncate text-sm font-bold text-slate-900">{{ authStore.user?.name || 'Member User' }}</p>
              <p class="truncate text-xs font-medium text-slate-500">{{ authStore.user?.email || 'member@kolabora.test' }}</p>
            </div>
            <button
              type="button"
              class="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-danger transition-colors hover:bg-red-50"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const isMobileMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)
const profileDropdownRef = ref(null)

const navItems = computed(() => {
  if (authStore.isAuthenticated) {
    return [
      { label: 'Explore Ideas', to: '/' },
      { label: 'My Ideas', to: '/my-projects' },
      { label: 'Requests', to: '/requests' },
    ]
  }

  return [
    { label: 'Explore Ideas', to: '/' },
  ]
})

const mobileItems = computed(() => {
  if (authStore.isAuthenticated) {
    return navItems.value
  }

  return [
    ...navItems.value,
    { label: 'Login', to: '/login' },
  ]
})

const ctaLink = computed(() => (
  authStore.isAuthenticated
    ? { label: 'Post Idea', to: '/create-idea' }
    : { label: 'Start a Project', to: '/register' }
))

const userInitials = computed(() => {
  if (!authStore.user?.name) return 'MU'

  const names = authStore.user.name.trim().split(/\s+/)
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }

  return names[0].substring(0, 2).toUpperCase()
})

const isActive = (path) => route.path === path

const closeMenus = () => {
  isMobileMenuOpen.value = false
  isProfileMenuOpen.value = false
}

const logout = async () => {
  closeMenus()
  await authStore.logout()
  router.push('/login')
}

const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    isProfileMenuOpen.value = false
  }
}

watch(() => route.fullPath, closeMenus)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
