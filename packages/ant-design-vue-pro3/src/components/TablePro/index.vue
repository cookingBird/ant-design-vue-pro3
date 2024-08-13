<template>
  <div ref="tableRefWrapper" class="table-pro-wrapper" :data-style="styled">
    <ant-table
      ref="tableRef"
      v-bind="props"
      :class="autoFitHeight ? 'table-pro--autoHeight' : ''"
      :columns="withDefaultCols"
    >
      <!-- :scroll="scroll" -->
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
              prop: column.prop,
              name: column.dataIndex,
              wrapperProps: column.wrapperProps,
            }"
          ></type-node-vue>
          <template v-else-if="column.dataIndex === 'index'">
            {{ index + 1 }}
          </template>
          <template v-else>
            {{ record[column.dataIndex] }}
          </template>
        </slot>
      </template>
    </ant-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { Table as AntTable } from 'ant-design-vue';
  import TypeNodeVue from '../TypeNode/index.vue';
  import type { TablePro } from '.';
  defineOptions({
    name: 'TablePro',
    inheritAttrs: true,
  });

  const props = withDefaults(defineProps<TablePro>(), {
    bordered: true,
    sticky: true,
    showHeader: true,
    autoFitHeight: true,
    styled: 'default',
  });

  const tableRefWrapper = ref<HTMLDivElement | null>(null);
  // const scroll = ref<{
  //   scrollToFirstRowOnChange?: boolean;
  //   x?: number;
  //   y?: number;
  // }>({});
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
