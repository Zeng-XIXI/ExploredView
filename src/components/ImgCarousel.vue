<template>
  <div class="carousel-box">
    <!-- 速度配置输入区 -->
    <div class="speed-setting">
      <div class="speed-item">
        <label>按住快进速度(ms)：</label>
        <input v-model.number="downSpeed" type="number" min="10" placeholder="数值越小越快">
      </div>
      <div class="speed-item">
        <label>松手回退速度(ms)：</label>
        <input v-model.number="upSpeed" type="number" min="50" placeholder="数值越小越快">
      </div>
    </div>

    <!-- 轮播容器 -->
    <div class="img-wrap" @mousedown="handleDown" @mouseup="handleUp" @mouseleave="handleUp">
      <img :src="currentImg" alt="图片轮播" class="show-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'

// 接收外部传入图片列表
const props = defineProps<{
  imgList: string[]
}>()

const currentIndex = ref(0)
const currentImg = ref('')

// 用户可自定义速度 默认值
const downSpeed = ref(80)   // 按住切换间隔
const upSpeed = ref(150)    // 松手回退间隔

let downTimer: number | null = null
let upTimer: number | null = null

// 监听图片列表变化自动重置
watch(
    () => props.imgList,
    (val) => {
      if (val && val.length > 0) {
        currentIndex.value = 0
        currentImg.value = val[0]
      }
    },
    { immediate: true }
)

// 按住快速向后轮播
const handleDown = () => {
  clearAllTimer()
  downTimer = window.setInterval(() => {
    if (currentIndex.value < props.imgList.length - 1) {
      currentIndex.value++
      currentImg.value = props.imgList[currentIndex.value]
    }
  }, downSpeed.value)
}

// 松手/移出 缓慢退回第一张
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

// 清空定时器
const clearAllTimer = () => {
  if (downTimer) clearInterval(downTimer)
  if (upTimer) clearInterval(upTimer)
}

// 组件销毁清除
onUnmounted(() => {
  clearAllTimer()
})
</script>

<style scoped>
.carousel-box {
  margin: 16px 0;
}
.speed-setting {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.speed-item label {
  font-size: 14px;
  color: #666;
  margin-right: 6px;
}
.speed-item input {
  width: 80px;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}
.img-wrap {
  width: 400px;
  height: 260px;
  overflow: hidden;
  border-radius: 8px;
  cursor: grab;
  user-select: none;
}
.show-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>