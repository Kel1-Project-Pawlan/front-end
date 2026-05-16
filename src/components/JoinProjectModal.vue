<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div class="glass-card p-0 max-w-md w-full relative overflow-hidden transform transition-all shadow-2xl">
        <!-- Decorative Top Bar -->
        <div class="h-2 w-full bg-gradient-to-r from-primary to-secondary"></div>
        
        <div class="p-8">
          <button @click="handleClose" class="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors bg-slate-100 rounded-full p-1 hover:bg-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div class="flex items-center gap-3 mb-6">
            <div class="p-3 bg-primary/10 text-primary rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-800">Join Project</h3>
          </div>

          <!-- Success State -->
          <div v-if="requestSuccess" class="text-center py-6 animate-fade-in-up">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h4 class="text-xl font-bold text-slate-800 mb-2">Request Sent!</h4>
            <p class="text-slate-500 mb-6">The project creator will review your request. Good luck!</p>
            <button @click="handleClose" class="btn-primary w-full">Awesome</button>
          </div>

          <!-- Form State -->
          <form v-else @submit.prevent="submitJoinRequest">
            <div class="mb-5">
              <label class="block text-sm font-semibold text-slate-700 mb-2">Message to Creator (Optional)</label>
              <textarea 
                v-model="joinMessage" 
                rows="4" 
                class="input-field resize-none shadow-sm"
                placeholder="Hi, I have experience in... I'd love to contribute to this project because..."
              ></textarea>
            </div>
            
            <div v-if="requestError" class="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ requestError }}
            </div>

            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="handleClose" class="px-5 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
              <button type="submit" class="btn-primary flex items-center gap-2" :disabled="requestLoading">
                <span v-if="requestLoading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ requestLoading ? 'Sending...' : 'Send Request' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '../services/api'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  ideaId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const joinMessage = ref('')
const requestLoading = ref(false)
const requestSuccess = ref(false)
const requestError = ref('')

// Reset state when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    requestSuccess.value = false
    requestError.value = ''
    joinMessage.value = ''
  }
})

const submitJoinRequest = async () => {
  requestLoading.value = true
  requestError.value = ''
  try {
    await api.post('/requests', {
      idea_id: props.ideaId,
      message: joinMessage.value
    })
    requestSuccess.value = true
    emit('success')
  } catch (err) {
    requestError.value = err.response?.data?.message || 'Failed to send request. Please try again.'
  } finally {
    requestLoading.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script>
