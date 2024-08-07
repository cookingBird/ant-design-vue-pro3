<template>
  <Row v-bind="props">
    <slot></slot>
  </Row>
</template>

<script setup lang="ts">
  import { Row, type RowProps } from 'ant-design-vue';
  const props = withDefaults(defineProps<RowProps>(), {
    align: 'top',
    gutter: 0,
    justify: 'start',
    wrap: true,
  });
</script>

<style>
  .ant-row {
    box-sizing: border-box;
  }
</style>
