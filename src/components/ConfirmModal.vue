<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div class="glass-card p-6 max-w-sm w-full relative transform transition-all shadow-2xl">
        <div class="flex flex-col items-center text-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" :class="config.isDestructive ? 'bg-red-100 text-red-500' : 'bg-primary/10 text-primary'">
            <svg v-if="config.isDestructive" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">{{ config.title }}</h3>
          <p class="text-sm text-slate-500 mb-6">{{ config.message }}</p>
          
          <div class="flex gap-3 w-full">
            <button @click="$emit('close')" class="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">
              {{ config.cancelText || 'Cancel' }}
            </button>
            <button @click="$emit('confirm')" class="flex-1 py-2 px-4 font-bold text-white rounded-lg transition-colors shadow-md" :class="config.isDestructive ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-primary hover:bg-orange-600 shadow-primary/30'">
              {{ config.confirmText || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
// Imports removed since defineProps and defineEmits are compiler macros

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  config: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      isDestructive: false
    })
  }
})

defineEmits(['close', 'confirm'])
</script>
