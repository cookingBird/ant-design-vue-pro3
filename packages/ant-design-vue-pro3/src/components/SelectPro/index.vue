<template>
  <AntSelect
    v-bind="omitProps"
    :value="innerValue"
    :loading="innerLoading"
    :options="builtOptions"
    @update:value="updateValueHandler"
  >
  </AntSelect>
</template>

<script lang="ts" setup>
  import { ref, computed, watchEffect, type PropType } from 'vue';
  import { Select as AntSelect } from 'ant-design-vue';
  import { selectProps } from 'ant-design-vue/es/select';
  import type { SelectOption } from '.';
  import { useFetch } from '../../hooks/fetch';
  import { useValue } from '../../hooks/value';
  import { callFunction, omit } from '../../tools/tool';
  import { merge } from 'lodash';

  const props = defineProps({
    ...selectProps(),
    // effected remote data
    effectKeys: [String, Array],
    fetch: Function as PropType<
      (
        model: any,
      ) => Promise<{ label: string; value: string | number; [key: string]: any }[]>
    >,
    // data bind
    model: Object,
    prop: String,
    // value convert
    beforeValue: {
      type: Function,
      default: (v) => v,
    },
    afterChange: {
      type: Function,
      default: (v) => v,
    },
  });
  const defaultOps = {
    placeholder: '请选择',
    mode: undefined,
    allowClear: true,
    maxTagCount: 'responsive',
    showSearch: false,
    filterOption: (input: string, option: any) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  };

  const omitProps = computed(() =>
    omit(
      merge(defaultOps, props),
      'model',
      'fetch',
      'open',
      'onUpdate:value',
      'beforeValue',
      'afterChange',
    ),
  );
  // fetch data
  const fetchOps = ref<SelectOption[]>([]);
  const builtOptions = computed(
    () => callFunction(props.options, props.model) ?? fetchOps.value,
  );
  const innerLoading = ref(false);
  if (props.fetch) {
    const { result, loading } = useFetch(
      props.fetch,
      computed(() => props.model),
      props.effectKeys,
    );
    watchEffect(() => {
      // console.log('select fetch', result.value);
      fetchOps.value = result.value;
      innerLoading.value = loading.value;
    });
  }
  // bind model
  const { valueGetter, valueSetter } = useValue(props.prop);
  const innerValue = computed(() => {
    const res = props.beforeValue!(props.value ?? valueGetter(props.model));
    return res === '' ? undefined : res;
  });
  const emit = defineEmits<{
    'update:value': [val: any];
  }>();
  const updateValueHandler = (val: any) => {
    const _n = props.afterChange!(val, builtOptions.value);
    emit('update:value', _n);
    props.model && valueSetter(props.model, _n);
  };
</script>

<style lang="scss">
  @import './index.scss';
</style>
