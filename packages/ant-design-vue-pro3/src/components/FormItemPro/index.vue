<template>
  <AntFormItem v-bind="props" class="form-item-pro">
    <slot></slot>
  </AntFormItem>
</template>

<script setup lang="ts">
  import type { FormItemProProps } from '.';
  import { FormItem as AntFormItem } from 'ant-design-vue';
  const props = withDefaults(defineProps<FormItemProProps>(), {
    autoLink: true,
    colon: undefined,
    hasFeedback: false,
    labelAlign: undefined,
    labelCol: undefined,
    required: false,
    validateFirst: false,
    validateTrigger: 'change',
  });
</script>

<style lng="scss">
  @import './index.scss';
</style>
