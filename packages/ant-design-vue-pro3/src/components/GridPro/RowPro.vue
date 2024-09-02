<template>
  <Row v-bind="merge(defaultProps, props)">
    <slot></slot>
  </Row>
</template>

<script setup lang="ts">
  import { Row } from 'ant-design-vue';
  import { rowProps } from 'ant-design-vue/es/grid/Row.js';
  import { merge } from 'lodash';
  const props = defineProps({ ...rowProps() });
  const defaultProps = {
    align: 'top',
    gutter: 0,
    justify: 'start',
    wrap: true,
  };
</script>

<style>
  .ant-row {
    box-sizing: border-box;
  }
</style>
