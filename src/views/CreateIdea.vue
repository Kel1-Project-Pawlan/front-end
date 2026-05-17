<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-8">
      <p class="mb-2 text-sm font-bold uppercase tracking-wide text-primary">Post Idea</p>
      <h1 class="text-3xl font-extrabold text-slate-900">Start a collaborative project</h1>
      <p class="mt-3 text-slate-500">
        Share the project goal, context, and invite link so collaborators can understand where they can help.
      </p>
    </div>

    <form class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" @submit.prevent="submitIdea">
      <div class="space-y-5">
        <div>
          <label for="title" class="mb-2 block text-sm font-semibold text-slate-700">Project Title</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            class="input-field"
            placeholder="E.g., Student productivity app"
          >
        </div>

        <div>
          <label for="description" class="mb-2 block text-sm font-semibold text-slate-700">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            required
            rows="6"
            class="input-field"
            placeholder="Describe your idea, goals, and the roles you are looking for..."
          ></textarea>
        </div>

        <div>
          <label for="whatsapp_link" class="mb-2 block text-sm font-semibold text-slate-700">WhatsApp Group Link</label>
          <input
            id="whatsapp_link"
            v-model="formData.whatsapp_link"
            type="url"
            class="input-field"
            placeholder="https://chat.whatsapp.com/..."
          >
        </div>

        <p v-if="error" class="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-danger">
          {{ error }}
        </p>
      </div>

      <div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <router-link
          to="/my-projects"
          class="rounded-lg px-5 py-2.5 text-center text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
        >
          Cancel
        </router-link>
        <button
          type="submit"
          class="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primaryHover hover:shadow-md hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="loading"
        >
          {{ loading ? 'Posting...' : 'Post Idea' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const formData = ref({
  title: '',
  description: '',
  whatsapp_link: '',
})

const submitIdea = async () => {
  loading.value = true
  error.value = ''

  try {
    await api.post('/ideas', formData.value)
    router.push('/my-projects')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to post idea.'
  } finally {
    loading.value = false
  }
}
</script>
