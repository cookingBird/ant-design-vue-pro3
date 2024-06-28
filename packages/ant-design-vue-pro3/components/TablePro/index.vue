<template>
  <div
    ref="tableRefWrapper"
    class="table-pro-wrapper"
    :class="$attrs.class"
    :data-style="styled"
    :style="$attrs.style as string"
  >
    <ant-table ref="tableRef" v-bind="props" :columns="withDefaultCols" :scroll="scroll">
      <template #bodyCell="{ column, record, index }">
        <slot
          :name="column.dataIndex"
          :column="column"
          :index="index"
          :record="record"
          :row="record"
        >
          <type-node-vue
            v-if="column.dataIndex !== undefined && column.slotIs"
            :model="record"
            :options="{
              slotIs: column.slotIs,
              slotProps: column.slotProps,
              prop: column.prop ?? column.dataIndex,
              wrapperProps: column.wrapperProps,
            }"
          ></type-node-vue>
          <template v-else>
            {{ record[column.dataIndex] }}
          </template>
        </slot>
      </template>
    </ant-table>
  </div>
</template>

<script lang="ts" setup>
  import TypeNodeVue from '../TypeNode/index.vue';
  import type { TablePro } from '.';
  import { useResizeObserver } from '@vueuse/core';
  import { Table as AntTable } from 'ant-design-vue';
  defineOptions({
    name: 'TablePro',
    inheritAttrs: false,
  });

  const props = withDefaults(defineProps<TablePro>(), {
    bordered: true,
    sticky: true,
    showHeader: true,
    autoFitHeight: true,
    styled: 'default',
  });

  const tableRefWrapper = ref<HTMLDivElement | null>(null);
  const scroll = ref<{
    scrollToFirstRowOnChange?: boolean;
    x?: number;
    y?: number;
  }>({});
  onMounted(() => {
    props.autoFitHeight &&
      useResizeObserver(tableRefWrapper, (entries) => {
        if (entries[0]) {
          const {
            contentRect: { height },
          } = entries[0];
          const { height: headerHeight = 53 } =
            tableRefWrapper.value
              ?.querySelector('.ant-table-header')
              ?.getBoundingClientRect() || {};

          scroll.value.y = Math.floor(height - headerHeight);
        }
      });
  });

  const withDefaultCols = computed(
    () =>
      props.columns?.map((col) => ({
        ...col,
        align: col.align ?? 'center',
      })) || [],
  );

  const tableRef = ref<typeof AntTable | null>(null);

  defineExpose({
    tableRef,
  });
</script>

<style lang="css">
  @import './index.scss';
</style>
