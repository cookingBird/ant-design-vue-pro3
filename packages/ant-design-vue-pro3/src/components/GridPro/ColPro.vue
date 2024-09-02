<template>
  <Col v-bind="props">
    <slot></slot>
  </Col>
</template>

<script setup lang="ts">
  import { Col, type ColProps } from 'ant-design-vue';
  import { colProps } from 'ant-design-vue/lib/grid/Col.js';
  const props = defineProps({
    ...colProps(),
  });
</script>

<style>
  .ant-col {
    box-sizing: border-box;
  }
</style>
