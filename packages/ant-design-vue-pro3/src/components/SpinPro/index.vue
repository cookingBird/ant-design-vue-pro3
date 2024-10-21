<template>
  <FullHeightWrapper>
    <template #default="slotProps">
      <Spin v-bind="props">
        <slot v-bind="slotProps"></slot>
      </Spin>
    </template>
  </FullHeightWrapper>
</template>

<script setup>
  import FullHeightWrapper from '../FullHeightWrapper/index.vue';
  import { Spin } from 'ant-design-vue';
  import { spinProps } from 'ant-design-vue/lib/spin/index';

  const props = defineProps({
    ...spinProps(),
  });
</script>
