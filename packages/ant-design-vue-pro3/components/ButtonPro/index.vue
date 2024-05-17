<template>
  <a-button v-bind="$attrs" :loading="loading" @click="handleClick">
    <slot></slot>
  </a-button>
</template>

<script setup lang="ts">
  import { Button as AButton } from 'ant-design-vue';
  const loading = ref(false);
  const emit = defineEmits<{
    click: [done: () => void];
  }>();
  function handleClick() {
    loading.value = true;
    emit('click', () => (loading.value = false));
  }
</script>
