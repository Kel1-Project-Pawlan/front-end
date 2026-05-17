<template>
  <div class="min-h-screen flex flex-col bg-slate-50 font-sans">
    <Navbar />

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
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'

const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchUser()
  }
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
