<template>
  <a-transfer
    v-bind="omitProps"
    :dataSource="innerDataSource"
    :targetKeys="targetKeys"
    @update:targetKeys="updateValueHandler"
    class="transfer-pro"
  >
    <template v-if="$slots.children" #children="slotProps">
      <slot name="children" v-bind="slotProps"> </slot>
    </template>
  </a-transfer>
</template>

<script setup lang="ts">
  import { type TransferPropsPro } from './index.d';
  import { useFetch } from '../../hooks/fetch';
  import { omit } from '../../tools/tool';
  import { useValue } from '../../hooks/value';
  defineOptions({
    name: 'TransferPro',
  });
  const props = withDefaults(defineProps<TransferPropsPro>(), {
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
    render: (item: any) => item.title,
  });
  console.log('transfer props', props);
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
