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
  import { ref, computed, watchEffect } from 'vue';
  import { Select as AntSelect } from 'ant-design-vue';
  import type { SelectOption, SelectPro } from '.';
  import { useFetch } from '../../hooks/fetch';
  import { useValue } from '../../hooks/value';
  import { callFunction, omit } from '../../tools/tool';

  const props = withDefaults(defineProps<SelectPro>(), {
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
    bordered: true,
    showArrow: true,
    placeholder: '请选择',
    mode: undefined,
    allowClear: true,
    maxTagCount: 'responsive',
    showSearch: false,
    filterOption: () => (input: string, option: any) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  });

  const omitProps = computed(() =>
    omit(props, 'model', 'fetch', 'open', 'onUpdate:value', 'beforeValue', 'afterChange'),
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
    const _n = props.afterChange!(val);
    emit('update:value', _n);
    props.model && valueSetter(props.model, _n);
  };
</script>

<style lang="scss">
  @import './index.scss';
</style>
