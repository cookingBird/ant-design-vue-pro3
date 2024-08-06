<template>
  <div class="pagination-pro-wrapper">
    <AntPagination v-bind="{ ...$attrs, ...props }"> <slot></slot> </AntPagination>
  </div>
</template>

<script setup lang="ts">
  import type { PaginationPro } from '.';
  import { Pagination as AntPagination } from 'ant-design-vue';

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
  @import './index.scss';
</style>
