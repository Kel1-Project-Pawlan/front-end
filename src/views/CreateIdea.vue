<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-8">
      <p class="mb-2 text-sm font-bold uppercase tracking-wide text-primary">{{ isEditing ? 'Edit Project' : 'Post Idea' }}</p>
      <h1 class="text-3xl font-extrabold text-slate-900">{{ isEditing ? 'Edit your collaborative project' : 'Start a collaborative project' }}</h1>
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
          <label class="mb-2 block text-sm font-semibold text-slate-700">Project Cover Image</label>
          <input
            ref="imageInputRef"
            type="file"
            accept="image/jpeg,image/png"
            class="sr-only"
            @change="handleImageChange"
          >

          <div
            v-if="!imagePreviewUrl"
            class="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition-colors hover:border-primary/60 hover:bg-primary/5"
            @click="openImagePicker"
          >
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path stroke-linecap="round" stroke-linejoin="round" d="m17 8-5-5-5 5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v12" />
              </svg>
            </div>
            <p class="text-sm font-bold text-slate-800">Upload a cover image</p>
            <p class="mt-1 text-sm text-slate-500">JPG or PNG, max 2MB</p>
          </div>

          <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div class="h-56 bg-slate-100">
              <img :src="imagePreviewUrl" alt="Project cover preview" class="h-full w-full object-cover">
            </div>
            <div class="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-800">{{ selectedImage?.name }}</p>
                <p class="text-xs font-medium text-slate-500">JPG or PNG, max 2MB</p>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                  @click="openImagePicker"
                >
                  Change
                </button>
                <button
                  type="button"
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-danger transition-colors hover:bg-red-50"
                  @click="removeImage"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <p v-if="imageError" class="mt-2 text-sm font-medium text-danger">{{ imageError }}</p>
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
          {{ loading ? (isEditing ? 'Saving...' : 'Posting...') : (isEditing ? 'Save Changes' : 'Post Idea') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { getIdeaImageUrl } from '../utils/imageUrl'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const fetching = ref(false)
const error = ref('')
const imageError = ref('')
const selectedImage = ref(null)
const imagePreviewUrl = ref('')
const imageInputRef = ref(null)
const formData = ref({
  title: '',
  description: '',
  whatsapp_link: '',
})

const isEditing = computed(() => !!route.params.id)

onMounted(async () => {
  if (isEditing.value) {
    fetching.value = true
    try {
      const response = await api.get(`/ideas/${route.params.id}`)
      const idea = response.data.data || response.data
      formData.value.title = idea.title
      formData.value.description = idea.description
      formData.value.whatsapp_link = idea.whatsapp_link || ''
      if (idea.image) {
        imagePreviewUrl.value = getIdeaImageUrl(idea.image)
      }
    } catch (err) {
      error.value = 'Failed to load project details.'
      console.error(err)
    } finally {
      fetching.value = false
    }
  }
})

const openImagePicker = () => {
  imageInputRef.value?.click()
}

const clearPreviewUrl = () => {
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
    imagePreviewUrl.value = ''
  }
}

const removeImage = () => {
  selectedImage.value = null
  imageError.value = ''
  clearPreviewUrl()

  if (imageInputRef.value) {
    imageInputRef.value.value = ''
  }
}

const handleImageChange = (event) => {
  const file = event.target.files?.[0]
  imageError.value = ''

  if (!file) return

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    removeImage()
    imageError.value = 'Please upload a JPG or PNG image.'
    return
  }

  if (file.size > MAX_IMAGE_SIZE) {
    removeImage()
    imageError.value = 'Image must be 2MB or smaller.'
    return
  }

  clearPreviewUrl()
  selectedImage.value = file
  imagePreviewUrl.value = URL.createObjectURL(file)
}

const buildRequestData = () => {
  const payload = new FormData()
  payload.append('title', formData.value.title)
  payload.append('description', formData.value.description)
  payload.append('whatsapp_link', formData.value.whatsapp_link || '')

  if (selectedImage.value) {
    payload.append('image', selectedImage.value)
  }

  return payload
}

const submitIdea = async () => {
  if (imageError.value) return

  loading.value = true
  error.value = ''

  try {
    const data = buildRequestData()
    if (isEditing.value) {
      if (data.has('image')) {
        data.append('_method', 'PUT')
        await api.post(`/ideas/${route.params.id}`, data)
      } else {
        await api.put(`/ideas/${route.params.id}`, formData.value)
      }
    } else {
      await api.post('/ideas', data)
    }
    router.push('/my-projects')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save project.'
  } finally {
    loading.value = false
  }
}

onUnmounted(clearPreviewUrl)
</script>
