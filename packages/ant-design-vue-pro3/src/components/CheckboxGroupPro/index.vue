<template>
  <AntCheckboxGroup v-bind="props"> </AntCheckboxGroup>
</template>

<script setup lang="ts">
  import { CheckboxGroup as AntCheckboxGroup } from 'ant-design-vue';
  import type { CheckboxGroupPro } from '.';
  const props = defineProps<CheckboxGroupPro>();
</script>

<style>
  @import './index.scss';
</style>
