<template>
  <DropDown>
    <template v-if="$slots.default" #default>
      <slot name="default"> </slot>
    </template>
    <template v-else>{{ props.label }}</template>
  </DropDown>
</template>

<script setup lang="ts">
  import { DropDown } from 'ant-design-vue';
  import { dropdownProps } from 'ant-design-vue/lib/dropdown/props';
  const props = defineProps({
    ...dropdownProps(),
    label: String,
  });
</script>

<style scoped></style>
