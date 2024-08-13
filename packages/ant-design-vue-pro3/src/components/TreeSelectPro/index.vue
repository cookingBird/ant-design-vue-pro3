<template>
  <AntTreeSelect
    v-bind="omitProps"
    class="tree-select-pro"
    :value="value"
    :loading="loading"
    :treeData="builtOptions"
    @update:value="updateValueHandler"
  >
  </AntTreeSelect>
</template>

<script lang="ts" setup>
  import { ref, computed, toRefs, watchEffect } from 'vue';
  import { TreeSelect as AntTreeSelect } from 'ant-design-vue';
  import type { SelectOption, TreeSelectPropsPro } from '.';
  import { useFetch } from '../../hooks/fetch';
  import { useValue } from '../../hooks/value';
  import { callFunction, omit } from '../../tools/tool';

  const props = withDefaults(defineProps<TreeSelectPropsPro>(), {
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
    bordered: true,
    showArrow: true,
    placeholder: '请选择',
    mode: undefined,
    allowClear: true,
    // @ts-expect-error
    dropdownStyle: "{ maxHeight: '400px', overflow: 'auto' }",
    showSearch: true,
  });
  const omitProps = computed(() =>
    omit(props, 'model', 'fetch', 'open', 'onUpdate:value'),
  );
  const propRefs = toRefs(props);
  const fetchOps = ref<SelectOption[]>([]);
  const builtOptions = computed(
    () => callFunction(props.options, props.model) ?? fetchOps.value,
  );
  const loading = ref(false);
  if (props.fetch) {
    const { result, loading } = useFetch(props.fetch, propRefs.model, props.effectKeys);
    watchEffect(() => {
      // console.log('select fetch', result.value);
      fetchOps.value = result.value;
      loading.value = loading.value;
    });
  }
  const { valueGetter, valueSetter } = useValue(props.prop);
  const value = computed(() =>
    props.beforeValue!(props.value ?? valueGetter(props.model)),
  );
  const emit = defineEmits<{
    'update:value': [val: any];
  }>();
  const updateValueHandler = (val: any) => {
    const _n = props.afterChange!(val);
    emit('update:value', _n);
    props.model && valueSetter(props.model, _n);
  };
</script>

<style lang="scss">
  @import './index.scss';
</style>
