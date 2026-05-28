<template>
  <div class="max-w-4xl mx-auto">
    <button @click="router.back()" class="text-slate-500 hover:text-primary flex items-center gap-2 mb-6 transition-colors font-medium">
      &larr; Back to ideas
    </button>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>

    <div v-else-if="error" class="glass-card p-10 text-center">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="idea" class="space-y-6">
      <div class="glass-card overflow-hidden">
        <div v-if="getIdeaImageUrl(idea.image)" class="h-72 bg-slate-100 sm:h-80">
          <img
            :src="getIdeaImageUrl(idea.image)"
            :alt="`${idea.title} cover image`"
            class="h-full w-full object-cover"
          >
        </div>

        <div class="p-8">
          <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <h1 class="text-3xl font-extrabold text-slate-800">{{ idea.title }}</h1>
            <span class="px-3 py-1 font-semibold rounded-full bg-primary/10 text-primary whitespace-nowrap border border-primary/20">
              {{ idea.status || 'Open' }}
            </span>
          </div>

          <div class="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
            <div class="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 border border-slate-300">
              {{ getInitials(idea.user?.name || 'User') }}
            </div>
            <div>
              <p class="text-slate-800 font-bold">{{ idea.user?.name || 'Anonymous' }}</p>
              <p class="text-slate-500 text-sm">Project Creator</p>
            </div>
          </div>

          <div class="max-w-none">
            <h3 class="text-xl font-bold text-slate-800 mb-4">Project Description</h3>
            <p class="text-slate-600 whitespace-pre-line leading-relaxed">{{ idea.description }}</p>
          </div>
        </div>
      </div>

      <!-- Action Box -->
      <div class="glass-card p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h4 class="text-lg font-bold text-slate-800">Interested in this project?</h4>
          <p class="text-slate-500 text-sm">Send a request to join the team and collaborate.</p>
        </div>
        
        <div v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="btn-primary inline-block">Login to Join</router-link>
        </div>
        <div v-else-if="authStore.user.role === 'admin'">
          <div class="flex gap-2 w-full sm:w-auto">
            <router-link :to="`/edit-idea/${idea.id}`" class="px-4 py-2 bg-indigo-50 text-primary font-bold rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
              Edit
            </router-link>
            <!-- Anda bisa menambahkan fungsi hapus di detail jika perlu -->
          </div>
        </div>
        <div v-else-if="isCreator">
          <span class="px-4 py-2 bg-slate-100 text-slate-500 font-medium rounded-lg cursor-not-allowed border border-slate-200 flex items-center gap-2">
            You created this
            <router-link :to="`/edit-idea/${idea.id}`" class="text-primary hover:underline font-bold text-sm ml-2">Edit</router-link>
          </span>
        </div>
        <div v-else>
          <!-- If accepted -->
          <div v-if="userRequestStatus === 'accepted'" class="px-4 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-lg border border-emerald-200 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
            Joined Team
          </div>
          <!-- If pending -->
          <button v-else-if="userRequestStatus === 'pending'" class="btn-primary w-full bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/40 cursor-not-allowed" disabled>
            <span class="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
              Request Sent
            </span>
          </button>
          <!-- If null or rejected -->
          <button 
            v-else
            @click="openJoinModal" 
            class="btn-primary w-full"
          >
            <span v-if="userRequestStatus === 'rejected'">Try Requesting Again</span>
            <span v-else>Request to Join</span>
          </button>
        </div>
      </div>

      <!-- WhatsApp Link Box -->
      <div v-if="idea.whatsapp_link && (isCreator || userRequestStatus === 'accepted' || authStore.user?.role === 'admin')" class="glass-card p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          </div>
          <div>
            <h4 class="text-lg font-bold text-slate-800">Team Workspace</h4>
            <p class="text-sm text-slate-600">Join the project's WhatsApp group to start collaborating.</p>
          </div>
        </div>
        <a :href="idea.whatsapp_link" target="_blank" rel="noopener noreferrer" class="btn-primary bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/40 whitespace-nowrap text-center">
          Join WhatsApp Group
        </a>
      </div>
    </div>

    <!-- Join Request Modal -->
    <JoinProjectModal 
      v-if="idea"
      :show="showJoinModal" 
      :idea-id="idea.id" 
      @close="showJoinModal = false" 
      @success="handleJoinSuccess" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import api from '../services/api'
import JoinProjectModal from '../components/JoinProjectModal.vue'
import { getIdeaImageUrl } from '../utils/imageUrl'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const idea = ref(null)
const loading = ref(true)
const error = ref('')

const showJoinModal = ref(false)
const userRequestStatus = ref(null)

const isCreator = computed(() => {
  if (!authStore.user || !idea.value) return false
  return authStore.user.id === idea.value.user_id
})

const fetchIdeaDetails = async () => {
  loading.value = true
  try {
    const response = await api.get(`/ideas/${route.params.id}`)
    idea.value = response.data.data || response.data
    
    // Check if current user has requested to join
    if (authStore.user) {
      const reqResponse = await api.get('/requests')
      const allRequests = reqResponse.data.data || reqResponse.data
      const existingReq = allRequests.find(r => r.idea_id === idea.value.id && r.user_id === authStore.user.id)
      if (existingReq) {
        userRequestStatus.value = existingReq.status
      }
    }
  } catch (err) {
    error.value = 'Failed to load project details.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openJoinModal = () => {
  showJoinModal.value = true
}

const handleJoinSuccess = () => {
  userRequestStatus.value = 'pending'
}



const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

onMounted(() => {
  fetchIdeaDetails()
})
</script>
