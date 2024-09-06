<template>
  <div ref="tableRefWrapper" class="table-pro-wrapper" :data-style="styled">
    <ant-table
      ref="tableRef"
      v-bind="mergedProps"
      :class="autoFitHeight ? 'table-pro--autoHeight' : ''"
      :columns="withDefaultCols"
      :dataSource="props.dataSource"
      :scroll="innerScroll"
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
  defineOptions({
    name: 'TablePro',
    inheritAttrs: true,
  });
  const tableRefWrapper = ref<HTMLDivElement | null>(null);

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
  const innerScroll = ref({
    x: true as string | number | true,
    y: null as any as string | number,
    scrollToFirstRowOnChange: true,
  });
  watchEffect(() => {
    const propsScroll = props.scroll;
    const columns = props.columns;
    if (propsScroll) {
      innerScroll.value.y = props.scroll.y ?? innerScroll.value.y;
      innerScroll.value.scrollToFirstRowOnChange =
        props.scroll.scrollToFirstRowOnChange ??
        innerScroll.value.scrollToFirstRowOnChange;
    }
    console.log('columns', columns);
    innerScroll.value.x =
      columns
        ?.filter((item) => !item.fixed)
        .reduce<number>((pre, cur) => {
          return pre + Number(cur.width || cur.minWidth || 80);
        }, 0) || true;
  });

  const mergedProps = computed(() => merge(defaultProps, props));

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

<style lang="scss">
  @import './index.scss';
</style>
