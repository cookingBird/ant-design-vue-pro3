<template>
  <AntTransfer
    v-bind="omitProps"
    :dataSource="innerDataSource"
    :targetKeys="targetKeys"
    class="transfer-pro"
    @update:targetKeys="updateValueHandler"
  >
    <template v-if="$slots.children" #children="slotProps">
      <slot name="children" v-bind="slotProps"> </slot>
    </template>
  </AntTransfer>
</template>

<script setup lang="ts">
  import { ref, computed, watchEffect } from 'vue';
  import { Transfer as AntTransfer } from 'ant-design-vue';
  import { type TransferPropsPro } from '.';
  import { useFetch } from '../../hooks/fetch';
  import { omit } from '../../tools/tool';
  import { useValue } from '../../hooks/value';
  defineOptions({
    name: 'TransferPro',
  });
  const props = withDefaults(defineProps<TransferPropsPro>(), {
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
    render: () => (item: any) => item.title,
    showSelectAll: true,
    locale: () => ({
      titles: [],
      notFoundContent: '列表为空',
      searchPlaceholder: '请输入搜索内容',
      itemUnit: '项',
      itemsUnit: '项',
      remove: '移除',
      selectAll: '全选所有',
      selectCurrent: '全选当页',
      selectInvert: '反选当页',
      removeAll: '取消全选',
      removeCurrent: '取消当页全选',
    }),
  });
  const omitProps = computed(() =>
    omit(
      props,
      'model',
      'fetch',
      'beforeValue',
      'afterChange',
      'onUpdate:targetKeys',
      'effectKeys',
      'prop',
    ),
  );
  const fetchDataSource = ref([]);
  if (props.fetch) {
    const { result } = useFetch(
      props.fetch,
      computed(() => props.model),
      props.effectKeys,
    );
    watchEffect(() => {
      // @ts-expect-error
      fetchDataSource.value = result.value;
    });
  }
  const innerDataSource = computed(() => props.dataSource ?? fetchDataSource.value);
  watchEffect(() => {
    console.log(innerDataSource.value);
  });
  // bind model
  const { valueGetter, valueSetter } = useValue(props.prop);
  const targetKeys = computed(() =>
    props.beforeValue!(props.targetKeys ?? valueGetter(props.model)),
  );
  const emit = defineEmits<{
    'update:targetKeys': [val: any];
  }>();
  const updateValueHandler = (val: any) => {
    const _n = props.afterChange!(val);
    emit('update:targetKeys', _n);
    props.model && valueSetter(props.model, _n);
  };
</script>

<style>
  @import './index.scss';
</style>
