<template>
  <div
    ref="tableWrapperRef"
    class="table-pro-wrapper"
    :class="{
      'table-pro--autoHeight': autoFitHeight,
      'table-pro--nooverflow': !isOverflow,
    }"
    :data-style="styled"
  >
    <FullHeightWrapper>
      <template #default="{ height }">
        <ant-table
          ref="tableRef"
          v-bind="mergedProps"
          :columns="props.columns"
          :dataSource="props.dataSource"
          :scroll="{
            y: Math.floor(height - headerHeight - 1),
          }"
        >
          <!-- :scroll="scroll" -->
          <template #bodyCell="{ column, record, index }">
            <slot
              v-if="column.dataIndex === 'index' || column.slotIs"
              :name="column.dataIndex"
              :column="column"
              :index="index"
              :record="record"
              :row="record"
            >
              <type-node-vue
                v-if="column.slotIs"
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
            </slot>
          </template>
        </ant-table>
      </template>
    </FullHeightWrapper>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, type PropType, watchEffect } from 'vue';
  import { Table as AntTable } from 'ant-design-vue';
  import TypeNodeVue from '../TypeNode/index.vue';
  import { tableProps } from 'ant-design-vue/es/table/index.js';
  import { merge } from 'lodash';
  import { useTableHeaderHeight, useTableContentHeight } from './hook';
  import FullHeightWrapper from '../FullHeightWrapper/index.vue';
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

  const defaultProps = {
    pagination: false,
  };

  const mergedProps = computed(() => merge(defaultProps, props));

  const tableWrapperRef = ref<HTMLDivElement | null>();
  const tableRef = ref<typeof AntTable | null>();
  const headerHeight = useTableHeaderHeight(tableRef);
  const contentHeight = useTableContentHeight(tableRef);
  const isOverflow = ref(false);
  watchEffect(() => {
    isOverflow.value =
      headerHeight.value + contentHeight.value > tableWrapperRef.value?.offsetHeight;
    console.log('isOverflow.value', isOverflow.value);
  });
  watchEffect(() => {
    console.warn('headerHeight', headerHeight.value);
  });
  watchEffect(() => {
    console.warn('contentHeight', contentHeight.value);
  });
  defineExpose({
    tableRef,
  });
</script>

<style lang="scss">
  @import './index.scss';
</style>
