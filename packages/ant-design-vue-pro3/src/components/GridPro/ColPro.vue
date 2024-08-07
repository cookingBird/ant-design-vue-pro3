<template>
  <Col v-bind="props">
    <slot></slot>
  </Col>
</template>

<script setup lang="ts">
  import { Col, type ColProps } from 'ant-design-vue';
  const props = withDefaults(defineProps<ColProps>(), {});
</script>

<style>
  .ant-col {
    box-sizing: border-box;
  }
</style>
