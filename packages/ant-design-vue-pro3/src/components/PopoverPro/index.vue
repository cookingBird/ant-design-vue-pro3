<template>
  <Popover v-bind="props">
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #content>
      <slot name="content"></slot>
    </template>
    <slot></slot>
  </Popover>
</template>

<script setup lang="ts">
  import { Popover } from 'ant-design-vue';
  import { popoverProps } from 'ant-design-vue/es/popover/index';
  const props = defineProps({
    ...popoverProps(),
  });
</script>

<style scoped></style>
