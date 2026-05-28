<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-10 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 mb-2">My Projects</h1>
        <p class="text-slate-500">Manage your projects and ideas here.</p>
      </div>
      <router-link to="/create-idea" class="bg-primary hover:bg-primaryHover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary/30 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
        New Project
      </router-link>
    </div>

    <div>
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>

      <div v-else-if="myIdeas.length === 0" class="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
        <div class="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2">No projects yet</h3>
        <p class="text-slate-500 mb-6">You haven't created any collaborative projects.</p>
        <router-link to="/create-idea" class="text-primary font-medium hover:text-primaryHover transition-colors">Create your first project →</router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="idea in myIdeas" :key="idea.id" class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md group">
          <div v-if="getIdeaImageUrl(idea.image)" class="h-40 bg-slate-100">
            <img
              :src="getIdeaImageUrl(idea.image)"
              :alt="`${idea.title} cover image`"
              class="h-full w-full object-cover"
              loading="lazy"
            >
          </div>

          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold text-slate-800 line-clamp-1 pr-10">
                <router-link :to="`/idea/${idea.id}`" class="hover:text-primary transition-colors">{{ idea.title }}</router-link>
              </h3>
              <span class="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 text-primary border border-indigo-100">
                {{ idea.status || 'Open' }}
              </span>neq
            </div>
            
            <p class="text-sm text-slate-500 line-clamp-2 mb-6 h-10">{{ idea.description }}</p>
            
            <div class="flex items-center justify-between border-t border-slate-100 pt-4">
              <div class="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                Created recently
              </div>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <router-link :to="`/edit-idea/${idea.id}`" class="text-slate-400 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-slate-50" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                </router-link>
                <button @click="confirmDeleteIdea(idea.id)" class="text-slate-400 hover:text-danger transition-colors p-1.5 rounded-lg hover:bg-red-50" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      :config="confirmModalConfig" 
      @close="showConfirmModal = false" 
      @confirm="confirmModalConfig.action" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import api from '../services/api'
import ConfirmModal from '../components/ConfirmModal.vue'
import { getIdeaImageUrl } from '../utils/imageUrl'

const authStore = useAuthStore()

const myIdeas = ref([])
const loading = ref(true)

const showConfirmModal = ref(false)
const confirmModalConfig = ref({
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  action: null,
  isDestructive: true
})

const fetchMyIdeas = async () => {
  loading.value = true
  try {
    const response = await api.get('/ideas')
    const allIdeas = response.data.data || response.data
    myIdeas.value = allIdeas.filter(idea => idea.user_id === authStore.user?.id)
  } catch (err) {
    console.error('Failed to load my ideas', err)
  } finally {
    loading.value = false
  }
}

const confirmDeleteIdea = (id) => {
  confirmModalConfig.value = {
    title: 'Delete Project',
    message: 'Are you sure you want to permanently delete this project? This action cannot be undone.',
    confirmText: 'Delete Project',
    cancelText: 'Cancel',
    action: async () => {
      try {
        await api.delete(`/ideas/${id}`)
        myIdeas.value = myIdeas.value.filter(idea => idea.id !== id)
        showConfirmModal.value = false
      } catch (err) {
        alert('Failed to delete idea.')
        console.error(err)
      }
    },
    isDestructive: true
  }
  showConfirmModal.value = true
}

onMounted(() => {
  fetchMyIdeas()
})
</script>
