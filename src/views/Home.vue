<template>
  <div>
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-800 mb-4">
        Discover Collaborative Projects
      </h1>
      <p class="text-slate-500 text-lg max-w-2xl mx-auto">
        Find exciting ideas to join, or create your own project and build a dream team.
      </p>
    </div>

    <!-- Search & Filter Bar -->
    <div class="glass-card p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="w-full md:w-1/2">
        <input 
          type="text" 
          placeholder="Search projects by title or tech stack..." 
          class="input-field w-full"
        >
      </div>
      <router-link v-if="authStore.isAuthenticated && authStore.user?.role !== 'admin'" to="/my-projects" class="bg-primary hover:bg-primaryHover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
        + Create New Idea
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-500">{{ error }}</p>
      <button @click="fetchIdeas" class="mt-4 btn-secondary">Try Again</button>
    </div>

    <!-- Ideas Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="idea in ideas" 
        :key="idea.id" 
        class="glass-card flex flex-col overflow-hidden hover:border-primary/50 transition-colors group cursor-pointer"
        @click="router.push(`/idea/${idea.id}`)"
      >
        <div v-if="getIdeaImageUrl(idea.image)" class="h-44 bg-slate-100">
          <img
            :src="getIdeaImageUrl(idea.image)"
            :alt="`${idea.title} cover image`"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          >
        </div>

        <div class="flex flex-grow flex-col p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">{{ idea.title }}</h3>
            <span class="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary whitespace-nowrap border border-primary/20">
              {{ idea.status || 'Open' }}
            </span>
          </div>
          
          <p class="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">
            {{ idea.description }}
          </p>

          <div class="flex items-center justify-between border-t border-slate-200 pt-4 mt-auto">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 border border-slate-300">
                {{ getInitials(idea.user?.name || 'User') }}
              </div>
              <span class="text-sm font-medium text-slate-700 truncate max-w-[120px]">{{ idea.user?.name || 'Anonymous' }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <!-- Admin Actions -->
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2" v-if="authStore.user?.role === 'admin'" @click.stop>
                <router-link :to="`/edit-idea/${idea.id}`" class="text-slate-400 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-slate-50" title="Admin Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                </router-link>
                <button @click="confirmDeleteIdea(idea.id)" class="text-slate-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors p-1.5" title="Admin Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>

              <router-link :to="`/idea/${idea.id}`" class="text-sm text-primary hover:text-orange-500 font-semibold">
                View Details &rarr;
              </router-link>
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

    <!-- Empty State -->
    <div v-if="!loading && !error && ideas.length === 0" class="text-center py-20 glass-card">
      <p class="text-slate-500 mb-4">No project ideas found.</p>
      <router-link v-if="authStore.isAuthenticated" to="/my-projects" class="bg-primary hover:bg-primaryHover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-block mt-4">
        Be the first to create one
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import api from '../services/api'
import { getIdeaImageUrl } from '../utils/imageUrl'
import ConfirmModal from '../components/ConfirmModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const ideas = ref([])
const loading = ref(true)
const error = ref('')

const showConfirmModal = ref(false)
const confirmModalConfig = ref({
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  action: null,
  isDestructive: true
})

const fetchIdeas = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await api.get('/ideas')
    // Asumsi Laravel mengembalikan { data: [...] } pada resource collection
    ideas.value = response.data.data || response.data
  } catch (err) {
    error.value = 'Failed to load project ideas. Please try again later.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const confirmDeleteIdea = (id) => {
  confirmModalConfig.value = {
    title: 'Admin Delete Project',
    message: 'Are you sure you want to permanently delete this project? This action cannot be undone and you are performing this as an Admin.',
    confirmText: 'Delete Project',
    cancelText: 'Cancel',
    action: async () => {
      try {
        await api.delete(`/ideas/${id}`)
        ideas.value = ideas.value.filter(idea => idea.id !== id)
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

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

onMounted(() => {
  fetchIdeas()
})
</script>
