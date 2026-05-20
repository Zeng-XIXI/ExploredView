<script setup lang="ts">
import type { FrameData } from '../composables/useVideoFrames'
import { getCurrentInstance, ref } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

// 开发环境挂载实例
if (import.meta.env.DEV) {
  (window as any)._FrameGrid_vue = getCurrentInstance()
}

const props = defineProps<{
  frames: FrameData[]
}>()

// 预览弹窗控制
const previewVisible = ref(false)
const currentPreview = ref<FrameData | null>(null)

// 打开预览
const openPreview = (frame: FrameData) => {
  currentPreview.value = frame
  previewVisible.value = true
}

// 关闭预览
const closePreview = () => {
  previewVisible.value = false
  currentPreview.value = null
}

// 下载单张图片
const downloadSingle = (frame: FrameData) => {
  const link = document.createElement('a')
  link.href = frame.dataUrl
  link.download = `frame_${frame.index}_${frame.timestamp.toFixed(2)}s.jpg`
  link.click()
}

// ==============================================
// 👇 一键下载所有图片 → 打包成 ZIP
// ==============================================
const downloadAllAsZip = async () => {
  const zip = new JSZip()
  const folder = zip.folder('视频帧图片')

  props.frames.forEach((frame) => {
    // 去掉 base64 前缀 data:image/jpeg;base64,
    const base64Data = frame.dataUrl.split(',')[1]
    folder?.file(
        `frame_${frame.index}_${frame.timestamp.toFixed(2)}s.jpg`,
        base64Data,
        { base64: true }
    )
  })

  // 生成并下载zip
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `视频帧_${new Date().getTime()}.zip`)
}
</script>

<template>
  <section class="frames-section">
    <h2>共抽取 {{ frames.length }} 帧</h2>

    <!-- 一键打包下载按钮 -->
    <button
        v-if="frames.length > 0"
        @click="downloadAllAsZip"
        class="download-all-btn"
    >
      ✨ 一键下载全部帧（压缩包）
    </button>

    <div class="frames-grid">
      <div
          v-for="frame in frames"
          :key="frame.index"
          class="frame-card"
      >
        <!-- 点击 → 打开预览（不直接下载）-->
        <img
            :src="frame.dataUrl"
            :alt="'Frame ' + frame.index"
            class="frame-img"
            @click="openPreview(frame)"
            style="cursor: zoom-in;"
        />
        <div class="frame-info">
          <span>#{{ frame.index }}</span>
          <span>{{ frame.timestamp.toFixed(2) }}s</span>
        </div>
      </div>
    </div>

    <!-- 大图预览弹窗 -->
    <div v-if="previewVisible" class="preview-modal" @click.self="closePreview">
      <div class="preview-content">
        <button class="preview-close" @click="closePreview">×</button>
        <img :src="currentPreview?.dataUrl" alt="预览图" class="preview-img" />
        <div class="preview-toolbar">
          <span>#{{ currentPreview?.index }} {{ currentPreview?.timestamp.toFixed(2) }}s</span>
          <button @click="downloadSingle(currentPreview!)" class="download-btn">
            下载这张图
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.frames-section h2 {
  font-size: 20px;
  margin: 0 0 16px;
}

.download-all-btn {
  padding: 8px 14px;
  margin-bottom: 16px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.download-all-btn:hover {
  background: #4338ca;
}

.frames-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.frame-card {
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  background: var(--code-bg);
}

.frame-img {
  width: 100%;
  display: block;
}

.frame-info {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  font-size: 13px;
  color: var(--text);
}

/* 预览弹窗 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.preview-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}
.preview-img {
  display: block;
  max-width: 100%;
  max-height: 85vh;
  border-radius: 8px;
}
.preview-close {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ff3b30;
  color: white;
  font-size: 20px;
  border: none;
  cursor: pointer;
  z-index: 10;
}
.preview-toolbar {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 14px;
}
.download-btn {
  padding: 6px 12px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>