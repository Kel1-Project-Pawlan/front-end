<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-10 text-center">
      <h1 class="mb-2 text-3xl font-bold text-slate-800">Request</h1>
      <p class="text-slate-500">Review incoming requests and track the ones you've sent.</p>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
      <div class="flex px-6 border-b border-slate-200">
        <button 
          @click="activeTab = 'inbox'" 
          class="relative flex items-center justify-center flex-1 gap-2 py-4 text-sm font-semibold transition-colors focus:outline-none"
          :class="activeTab === 'inbox' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z"></path><path d="m4 6 8 5 8-5"></path></svg>
          Inbox
          <span v-if="myRequests.length" class="bg-primary/10 text-primary py-0.5 px-2 rounded-full text-xs ml-1">{{ myRequests.length }}</span>
          <div v-if="activeTab === 'inbox'" class="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"></div>
        </button>
        <button 
          @click="activeTab = 'sent'" 
          class="relative flex items-center justify-center flex-1 gap-2 py-4 text-sm font-semibold transition-colors focus:outline-none"
          :class="activeTab === 'sent' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
          Sent
          <span v-if="mySentRequests.length" class="bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs ml-1">{{ mySentRequests.length }}</span>
          <div v-if="activeTab === 'sent'" class="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"></div>
        </button>
      </div>
      
      <div class="flex-grow p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
        <!-- Loading State -->
        <div v-if="loadingRequests" class="flex justify-center py-20">
          <div class="w-8 h-8 border-4 rounded-full animate-spin border-primary border-t-transparent"></div>
        </div>

        <!-- Inbox Tab -->
        <template v-else-if="activeTab === 'inbox'">
          <div v-if="myRequests.length === 0" class="py-20 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <h3 class="mb-1 text-lg font-bold text-slate-800">No incoming requests</h3>
            <p class="text-sm font-medium text-slate-500">Join requests on your projects will appear here</p>
          </div>
          <div v-else class="max-w-2xl mx-auto space-y-4">
            <div v-for="req in myRequests" :key="req.id" class="p-5 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-full bg-indigo-50 text-primary">
                    {{ getInitials(req.user?.name || 'User') }}
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-800">{{ req.user?.name }}</h4>
                    <p class="text-xs text-slate-500">wants to join: <span class="font-medium text-slate-700">{{ req.idea?.title }}</span></p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full"
                        :class="{
                          'bg-yellow-100 text-yellow-700': req.status === 'pending',
                          'bg-emerald-100 text-emerald-700': req.status === 'accepted',
                          'bg-red-100 text-red-700': req.status === 'rejected'
                        }">
                    {{ req.status }}
                  </span>
                  <button @click="confirmDeleteRequest(req.id, 'inbox')" class="p-1 transition-colors text-slate-400 hover:text-danger" title="Delete Request">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
              
              <div v-if="req.message" class="p-4 mt-2 mb-4 text-sm border rounded-lg text-slate-600 bg-slate-50 border-slate-100">
                "{{ req.message }}"
              </div>
              
              <div v-if="req.status === 'pending'" class="flex gap-3 mt-4">
                <button @click="updateRequestStatus(req.id, 'accepted')" class="flex-1 py-2.5 text-sm font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors">
                  Accept
                </button>
                <button @click="updateRequestStatus(req.id, 'rejected')" class="flex-1 py-2.5 text-sm font-bold bg-red-50 text-danger hover:bg-danger hover:text-white rounded-lg transition-colors">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Sent Tab -->
        <template v-else-if="activeTab === 'sent'">
          <div v-if="mySentRequests.length === 0" class="py-20 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            <h3 class="mb-1 text-lg font-bold text-slate-800">No sent requests</h3>
            <p class="text-sm font-medium text-slate-500">Requests you send to join projects will appear here</p>
          </div>
          <div v-else class="max-w-2xl mx-auto space-y-4">
            <div v-for="req in mySentRequests" :key="req.id" class="p-5 transition-shadow bg-white border shadow-sm rounded-xl border-slate-200 hover:shadow-md">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-4">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-slate-800">{{ req.idea?.title }}</h4>
                    <p class="text-sm text-slate-500">Project by: <span class="font-medium text-slate-700">{{ req.idea?.user?.name }}</span></p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <span class="px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider"
                        :class="{
                          'bg-yellow-100 text-yellow-700': req.status === 'pending',
                          'bg-emerald-100 text-emerald-700': req.status === 'accepted',
                          'bg-red-100 text-red-700': req.status === 'rejected'
                        }">
                    {{ req.status }}
                  </span>
                  <button @click="confirmDeleteRequest(req.id, 'sent')" class="p-2 transition-colors rounded-lg text-slate-400 hover:text-danger hover:bg-red-50" title="Delete Request">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
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

const authStore = useAuthStore()

const myRequests = ref([])
const mySentRequests = ref([])
const loadingRequests = ref(true)
const activeTab = ref('inbox')

const showConfirmModal = ref(false)
const confirmModalConfig = ref({
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  action: null,
  isDestructive: true
})

const fetchMyRequests = async () => {
  loadingRequests.value = true
  try {
    const response = await api.get('/requests')
    const allRequests = response.data.data || response.data
    // Only show requests for ideas owned by the current user (incoming)
    myRequests.value = allRequests.filter(req => req.idea?.user_id === authStore.user?.id)
    // Show requests created by the current user (outgoing)
    mySentRequests.value = allRequests.filter(req => req.user_id === authStore.user?.id)
  } catch (err) {
    console.error('Failed to load requests', err)
  } finally {
    loadingRequests.value = false
  }
}

const updateRequestStatus = async (id, newStatus) => {
  try {
    await api.put(`/requests/${id}`, { status: newStatus })
    // Update local state
    const req = myRequests.value.find(r => r.id === id)
    if (req) {
      req.status = newStatus
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update request status.')
  }
}

const confirmDeleteRequest = (id, type) => {
  confirmModalConfig.value = {
    title: 'Delete Request',
    message: type === 'inbox' 
      ? 'Are you sure you want to permanently remove this request from your inbox?' 
      : 'Are you sure you want to cancel and delete this request?',
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
    action: async () => {
      try {
        await api.delete(`/requests/${id}`)
        if (type === 'inbox') {
          myRequests.value = myRequests.value.filter(req => req.id !== id)
        } else {
          mySentRequests.value = mySentRequests.value.filter(req => req.id !== id)
        }
        showConfirmModal.value = false
      } catch (err) {
        alert('Failed to delete request.')
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
  fetchMyRequests()
})
</script>
