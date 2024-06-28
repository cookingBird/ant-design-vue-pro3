<template>
  <div class="pagination-pro-wrapper">
    <a-pagination v-bind="{ ...$attrs, ...props }"> <slot></slot> </a-pagination>
  </div>
</template>

<script setup lang="ts">
  import type { PaginationPro } from '.';

  defineOptions({
    name: 'PaginationPro',
    inheritAttrs: true,
  });

  const props = withDefaults(defineProps<PaginationPro>(), {
    showSizeChanger: true,
    pageSizeOptions: () => ['10', '20', '30', '50', '70', '100'],
    showTotal: (total: number) => `共 ${total} 条`,
  });
</script>

<style>
  .pagination-pro-wrapper {
    display: flex;
    justify-content: flex-end;
  }
</style>
