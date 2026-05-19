<script setup lang="ts">
import type { FrameData } from '../composables/useVideoFrames'

defineProps<{
  frames: FrameData[]
}>()
</script>

<template>
  <section class="frames-section">
    <h2>共抽取 {{ frames.length }} 帧</h2>
    <div class="frames-grid">
      <div v-for="frame in frames" :key="frame.index" class="frame-card">
        <img :src="frame.dataUrl" :alt="'Frame ' + frame.index" class="frame-img" />
        <div class="frame-info">
          <span>#{{ frame.index }}</span>
          <span>{{ frame.timestamp.toFixed(2) }}s</span>
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
</style>