<script setup lang="ts">
defineProps<{
  extracting: boolean
  fps: number
}>()

const emit = defineEmits<{
  (e: 'extract'): void
  (e: 'update:fps', value: number): void
}>()
</script>

<template>
  <div class="control-bar">
    <label class="fps-label">
      抽取帧率 (fps)：
      <input
        :value="fps"
        type="number"
        min="0.1"
        max="30"
        step="0.1"
        class="fps-input"
        @input="emit('update:fps', Number(($event.target as HTMLInputElement).value))"
      />
    </label>
    <button :disabled="extracting" class="extract-btn" @click="emit('extract')">
      {{ extracting ? '抽取中...' : '开始抽取帧' }}
    </button>
  </div>
</template>

<style scoped>
.control-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.fps-label {
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fps-input {
  width: 80px;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  background: var(--bg);
  color: var(--text-h);
}

.extract-btn {
  padding: 10px 24px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  transition: opacity 0.2s;
}

.extract-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.extract-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>