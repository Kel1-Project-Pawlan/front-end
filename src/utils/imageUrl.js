import api from '../services/api'

const apiOrigin = new URL(api.defaults.baseURL).origin

export const getIdeaImageUrl = (image) => {
  if (!image) return ''
  if (/^https?:\/\//i.test(image)) return image

  const path = String(image)
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^public\//, '')
    .replace(/^storage\//, '')

  return encodeURI(`${apiOrigin}/storage/${path}`)
}
