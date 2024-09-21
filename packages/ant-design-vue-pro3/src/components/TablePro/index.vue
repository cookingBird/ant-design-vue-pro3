<template>
  <div class="table-pro-wrapper" :data-style="styled">
    <ant-table
      ref="tableRef"
      v-bind="mergedProps"
      :class="autoFitHeight ? 'table-pro--autoHeight' : ''"
      :columns="props.columns"
      :dataSource="props.dataSource"
      :scroll="scroll"
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
  import { ref, computed, type PropType, watchEffect } from 'vue';
  import { Table as AntTable } from 'ant-design-vue';
  import TypeNodeVue from '../TypeNode/index.vue';
  import { tableProps } from 'ant-design-vue/es/table/index.js';
  import { merge } from 'lodash';
  import { useScrollY } from './hook';
  defineOptions({
    name: 'TablePro',
    inheritAttrs: true,
  });

  const props = defineProps({
    ...tableProps(),
    styled: {
      type: String as PropType<'default' | 'transparent'>,
      default: 'default',
    },
    autoFitHeight: {
      type: Boolean,
      default: true,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
  });

  const defaultProps = {};

  const mergedProps = computed(() => merge(defaultProps, props));

  const tableRef = ref<typeof AntTable | null>();
  // @ts-expect-error
  const scroll = props.autoFitHeight ? useScrollY(tableRef) : ref({});

  defineExpose({
    tableRef,
  });
</script>

<style lang="scss">
  @import './index.scss';
</style>
