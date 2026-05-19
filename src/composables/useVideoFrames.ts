import { ref } from 'vue'

export interface FrameData {
  index: number
  timestamp: number
  dataUrl: string
}

export function useVideoFrames() {
  const frames = ref<FrameData[]>([])
  const extracting = ref(false)
  const extractProgress = ref(0)

  function extract(video: HTMLVideoElement, fps: number): Promise<FrameData[]> {
    return new Promise((resolve) => {
      extracting.value = true
      extractProgress.value = 0
      frames.value = []

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')!

      const totalFrames = Math.ceil(video.duration * fps)
      const frameList: FrameData[] = []
      let currentFrame = 0

      function onSeek() {
        ctx.drawImage(video, 0, 0)
        frameList.push({
          index: currentFrame,
          timestamp: currentFrame / fps,
          dataUrl: canvas.toDataURL('image/jpeg', 0.85),
        })
        currentFrame++
        extractProgress.value = Math.round((currentFrame / totalFrames) * 100)

        if (currentFrame < totalFrames) {
          video.currentTime = currentFrame / fps
        } else {
          frames.value = frameList
          extracting.value = false
          video.removeEventListener('seeked', onSeek)
          resolve(frameList)
        }
      }

      video.addEventListener('seeked', onSeek)
      video.currentTime = 0
    })
  }

  return { frames, extracting, extractProgress, extract }
}