<template>
  <a-checkbox-group v-bind="props"> </a-checkbox-group>
</template>

<script setup lang="ts">
  import type { CheckboxGroupPro } from '.';
  const props = defineProps<CheckboxGroupPro>();
</script>

<style>
  @import './index.scss';
</style>
