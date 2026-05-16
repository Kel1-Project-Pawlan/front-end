<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div class="glass-card p-6 max-w-lg w-full relative">
        <button @click="$emit('close')" class="absolute top-4 right-4 text-slate-400 hover:text-slate-800">
          &times;
        </button>
        <h3 class="text-2xl font-bold text-slate-800 mb-6">{{ isEditing ? 'Edit Project' : 'Create New Project' }}</h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Project Title</label>
            <input 
              v-model="formData.title" 
              type="text" 
              required 
              class="input-field"
              placeholder="E.g., Next-Gen E-commerce App"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea 
              v-model="formData.description" 
              required 
              rows="5" 
              class="input-field"
              placeholder="Describe your project idea, goals, and the roles you are looking for..."
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">WhatsApp Group Link (Optional)</label>
            <input 
              v-model="formData.whatsapp_link" 
              type="url" 
              class="input-field"
              placeholder="https://chat.whatsapp.com/..."
            >
          </div>
          
          <div v-if="error" class="text-red-500 text-sm">
            {{ error }}
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="$emit('close')" class="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Project') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({ title: '', description: '', whatsapp_link: '' })
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({ ...props.initialData })

// Watch for changes when modal opens or initialData changes
watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal }
}, { deep: true })

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>
