import { ref } from 'vue'

export function useVideoUpload() {
  const videoSrc = ref<string | null>(null)
  const fileName = ref('')

  function upload(file: File) {
    fileName.value = file.name
    if (videoSrc.value) {
      URL.revokeObjectURL(videoSrc.value)
    }
    videoSrc.value = URL.createObjectURL(file)
  }

  function reset() {
    if (videoSrc.value) {
      URL.revokeObjectURL(videoSrc.value)
    }
    videoSrc.value = null
    fileName.value = ''
  }

  return { videoSrc, fileName, upload, reset }
}