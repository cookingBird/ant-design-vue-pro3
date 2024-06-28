<template>
  <a-form-item v-bind="props" class="form-item-pro">
    <slot></slot>
  </a-form-item>
</template>

<script setup lang="ts">
  import type { FormItemProProps } from '.';
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
