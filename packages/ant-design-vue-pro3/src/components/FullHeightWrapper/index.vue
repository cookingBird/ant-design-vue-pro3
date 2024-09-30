<template>
  <div
    ref="el"
    class="pro-fullHeightWrapper"
  >
    <slot
      :width="width"
      :height="height"
      :fullHeight="fullHeight"
    ></slot>
  </div>
</template>

<script setup lang="ts">
  import { useElementSize } from '@vueuse/core';
  import { ref, computed } from 'vue';

  const el = ref(null);
  const { width, height } = useElementSize(el);
  const fullHeight = computed(() => `height:${height.value}px;`);
</script>

<style scoped>
  .pro-fullHeightWrapper {
    height: 100%;
  }
</style>
