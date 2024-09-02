<template>
  <AntFormItem v-bind="props" class="form-item-pro">
    <slot></slot>
  </AntFormItem>
</template>

<script setup lang="ts">
  import { FormItem as AntFormItem } from 'ant-design-vue';
  import { formItemProps } from 'ant-design-vue/es/form/FormItem.js';
  const props = defineProps({
    ...formItemProps(),
  });
</script>

<style lng="scss">
  @import './index.scss';
</style>
