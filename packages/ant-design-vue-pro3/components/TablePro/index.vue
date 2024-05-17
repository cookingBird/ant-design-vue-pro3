<template>
  <AntTable ref="tableRef" v-bind="attrs">
    <template #bodyCell="{ column, record }">
      <type-node
        v-if="column.dataIndex !== void 0 && slotsColNames.includes(column.dataIndex)"
        :model="record"
        :options="{
          ...column,
          name: column.dataIndex,
        }"
      >
      </type-node>
    </template>
  </AntTable>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import type { TablePropsPro } from '../../types/table';
  import TypeNodeVue from '../TypeNode/index.vue';
  import type { TypeNodeProp } from '../TypeNode';
  import { Table as AntTable } from 'ant-design-vue';
  export default defineComponent({
    name: 'ATablePro',
    components: {
      TypeNode: TypeNodeVue,
    },
    inheritAttrs: false,
    setup(props, { slots, attrs, expose, emit }) {
      const { columns } = attrs as unknown as TablePropsPro<any, TypeNodeProp>;
      function getCols(col: any) {
        let result = [];
        if (col.slotIs && col.dataIndex) {
          result.push(col);
        }
        if (col.children?.length > 0) {
          const cols = col.children.map((c: any) => getCols(c));
          result = result.concat(cols.flat());
        }
        return result;
      }
      const slotsCols = computed(() => columns.map((c) => getCols(c)).flat());
      const slotsColNames = computed(() => slotsCols.value.map((col) => col.dataIndex));
      return {
        attrs,
        slotsCols,
        slotsColNames,
      };
    },
  });
</script>

<style lang="css">
  @import './index.css';
</style>
