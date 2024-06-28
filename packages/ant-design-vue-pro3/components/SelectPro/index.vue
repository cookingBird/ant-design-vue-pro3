<template>
  <a-select
    v-bind="omitProps"
    :value="value"
    :loading="innerLoading"
    :options="builtOptions"
    @update:value="updateValueHandler"
  >
  </a-select>
</template>

<script lang="ts" setup>
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
  });
  // console.log('select props', props);
  const omitProps = computed(() =>
    omit(props, 'model', 'fetch', 'open', 'onUpdate:value', 'beforeValue', 'afterChange'),
  );
  const propRefs = toRefs(props);
  const fetchOps = ref<SelectOption[]>([]);
  const builtOptions = computed(
    () => callFunction(props.options, props.model) ?? fetchOps.value,
  );
  const innerLoading = ref(false);
  if (props.fetch) {
    const { result, loading } = useFetch(props.fetch, propRefs.model, props.effectKeys);
    watchEffect(() => {
      // console.log('select fetch', result.value);
      fetchOps.value = result.value;
      innerLoading.value = loading.value;
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
