<template>
  <div class="carousel-box">
    <!-- 速度配置 -->
    <div class="speed-setting">
      <div class="speed-item">
        <label>按住快进速度 (ms)</label>
        <input v-model.number="downSpeed" type="number" min="10" />
      </div>
      <div class="speed-item">
        <label>松手回退速度 (ms)</label>
        <input v-model.number="upSpeed" type="number" min="50" />
      </div>
    </div>

    <!-- 轮播主体（全屏自适应、大图展示） -->
    <div class="img-wrap" style="position:relative;"
         @mousedown="handleDown" @mouseup="handleUp" @mouseleave="handleUp"
         @touchstart="handleDown" @touchend="handleUp"  @touchmove="handleUp">
      <div style="width: 100%;height: 100%;position: absolute;top:0;left: 0;border: 1px solid red;background: rgba(29,78,216,0.3)"></div>
      <img :src="currentImg" alt="轮播" class="show-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'

const props = defineProps<{
  imgList: string[]
}>()

const currentIndex = ref(0)
const currentImg = ref('')
const downSpeed = ref(80)
const upSpeed = ref(150)

let downTimer: number | null = null
let upTimer: number | null = null

watch(
    () => props.imgList,
    (val) => {
      if (val?.length) {
        currentIndex.value = 0
        currentImg.value = val[0]
      }
    },
    { immediate: true }
)

const handleDown = () => {
  console.log("handleDown")
  clearAllTimer()
  downTimer = window.setInterval(() => {
    if (currentIndex.value < props.imgList.length - 1) {
      currentIndex.value++
      currentImg.value = props.imgList[currentIndex.value]
    }
  }, downSpeed.value)
}

const handleUp = () => {
  clearAllTimer()
  upTimer = window.setInterval(() => {
    if (currentIndex.value > 0) {
      currentIndex.value--
      currentImg.value = props.imgList[currentIndex.value]
    } else {
      clearInterval(upTimer!)
    }
  }, upSpeed.value)
}

const clearAllTimer = () => {
  if (downTimer) clearInterval(downTimer)
  if (upTimer) clearInterval(upTimer)
}

onUnmounted(clearAllTimer)
</script>

<style>
/* 这个样式是全局的，不会加 data-v 前缀，IDE 也不会报错 */
</style>

<style scoped>
.carousel-box {
  width: 100%;
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.speed-setting {
  width: 100%;
  max-width: 900px;
  display: flex;
  gap: 22px;
  margin-bottom: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.speed-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.speed-item label {
  font-size: 14px;
  color: #444;
}

.speed-item input {
  width: 90px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
}

/* -------- 核心：大图轮播区域 -------- */
.img-wrap {
  width: 95%;
  max-width: 900px;
  height: auto;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.show-img {
  width: 100%;
  height: 100%;
  /* 关键：保持图片原始比例，不拉伸 */
  object-fit: contain;
  display: block;
}
</style>