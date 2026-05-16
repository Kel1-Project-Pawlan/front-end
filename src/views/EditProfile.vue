<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-10 text-center">
      <h1 class="text-3xl font-bold text-slate-800 mb-2">Edit Profile</h1>
      <p class="text-slate-500">Update your personal information and settings.</p>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div class="flex flex-col items-center mb-8">
        <div class="w-24 h-24 rounded-full bg-indigo-50 text-primary flex items-center justify-center font-bold text-3xl mb-4 border-2 border-indigo-100">
          {{ getInitials(authStore.user?.name || 'User') }}
        </div>
        <button class="text-sm font-medium text-primary hover:text-primaryHover transition-colors">Change Avatar</button>
      </div>

      <form @submit.prevent="saveProfile" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
          <input 
            type="text" 
            v-model="profileForm.name" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-800"
            placeholder="Your Name"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
          <input 
            type="email" 
            v-model="profileForm.email" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-800"
            placeholder="your.email@example.com"
            disabled
          />
          <p class="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <router-link to="/" class="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</router-link>
          <button type="submit" class="bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const profileForm = ref({
  name: '',
  email: ''
})

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

const saveProfile = async () => {
  alert('Profile updated successfully! (Placeholder)')
  router.push('/')
}

onMounted(() => {
  if (authStore.user) {
    profileForm.value.name = authStore.user.name
    profileForm.value.email = authStore.user.email
  }
})
</script>
