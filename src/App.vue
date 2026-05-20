<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVideoUpload } from './composables/useVideoUpload'
import { useVideoFrames } from './composables/useVideoFrames'
import ExtractControls from './components/ExtractControls.vue'
import FrameGrid from './components/FrameGrid.vue'

const { videoSrc, fileName, upload } = useVideoUpload()
const { frames, extracting, extractProgress, extract } = useVideoFrames()

const videoEl = ref<HTMLVideoElement | null>(null)
const fps = ref(1)


// 页面加载后，自动加载演示视频
onMounted(async () => {
  console.log("start")
  // 这里填写你的演示视频路径（public 目录下的直接路径）
  try {
    // 1. 你的默认视频路径（public 目录下）
    const defaultVideoUrl = '/video/example.mp4'

    // 2. 下载视频 → 转成 Blob → 转成 File
    const response = await fetch(defaultVideoUrl)
    const blob = await response.blob()
    const file = new File([blob], 'example.mp4', { type: blob.type })

    upload(file)
  } catch (err) {
    console.error('加载默认视频失败', err)
  }
})

// ✅ 新增：下载默认视频方法
function downloadDefaultVideo() {
  const a = document.createElement('a')
  a.href = '/video/example.mp4'
  a.download = 'example.mp4'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function handleFileChange(event: Event) {
  console.log("上传按钮", event)
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) upload(file)
}

async function handleExtract() {
  const video = videoEl.value
  if (!video) return
  await extract(video, fps.value)
}
</script>

<template>
  <div class="app">
    <header>
      <h1>爆炸视图全景快播</h1>
    </header>

    <section class="upload-area">
      <label class="upload-btn">
        选择视频文件
        <input type="file" accept="video/*" hidden @change="handleFileChange" />
      </label>

      <!-- ✅ 新增：下载示例视频按钮 -->
      <button class="download-btn" @click="downloadDefaultVideo">
        下载示例视频
      </button>

      <span v-if="fileName" class="file-name">{{ fileName }}</span>
    </section>

    <section v-if="videoSrc" class="video-section">
      <video
          ref="videoEl"
          :src="videoSrc"
          controls
          preload="auto"
          class="video-preview"
      ></video>

      <ExtractControls
          :extracting="extracting"
          :fps="fps"
          @extract="handleExtract"
          @update:fps="fps = $event"
      />

      <div v-if="extracting" class="progress-bar-wrapper">
        <div class="progress-bar" :style="{ width: extractProgress + '%' }"></div>
        <span class="progress-text">{{ extractProgress }}%</span>
      </div>
    </section>

    <FrameGrid v-if="frames.length" :frames="frames" />
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

header h1 {
  font-size: 28px;
  margin: 0 0 24px;
  color: var(--text-h);
}

.upload-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.upload-btn {
  display: inline-block;
  padding: 10px 20px;
  background: var(--accent);
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  transition: opacity 0.2s;
}

.upload-btn:hover {
  opacity: 0.85;
}

/* ✅ 新增：下载按钮样式 */
.download-btn {
  display: inline-block;
  padding: 10px 20px;
  background: #1677ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  transition: opacity 0.2s;
}
.download-btn:hover {
  opacity: 0.85;
}

.file-name {
  font-size: 14px;
  color: var(--text);
}

.video-section {
  margin-bottom: 32px;
}

.video-preview {
  width: 100%;
  max-height: 500px;
  border-radius: 8px;
  background: #000;
}

.progress-bar-wrapper {
  margin-top: 12px;
  height: 24px;
  background: var(--code-bg);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: var(--accent);
  transition: width 0.2s;
}

.progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-h);
}
</style>