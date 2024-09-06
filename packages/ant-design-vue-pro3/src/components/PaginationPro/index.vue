<template>
  <div class="pagination-pro-wrapper">
    <AntPagination v-bind="merge(defaultProps, props)"> <slot></slot> </AntPagination>
  </div>
</template>

<script setup lang="ts">
  import { Pagination as AntPagination } from 'ant-design-vue';
  import { paginationProps } from 'ant-design-vue/es/pagination/index.js';
  import { merge } from 'lodash';

  defineOptions({
    name: 'PaginationPro',
    inheritAttrs: true,
  });

  const props = defineProps({ ...paginationProps() });
  const defaultProps = {
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '50', '70', '100'],
    showTotal: (total: number) => `共 ${total} 条`,
  };
</script>

<style lang="scss">
  @import './index.scss';
</style>
