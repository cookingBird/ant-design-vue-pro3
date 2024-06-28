<template>
  <a-switch
    v-bind="omitProps"
    :checked="innerValue"
    @update:checked="updateValueHandler"
  ></a-switch>
</template>

<script setup lang="ts">
  import type { SwitchPro } from '.';
  import { omit } from '../../tools/tool';
  import { useValue } from '../../hooks/value';
  defineOptions({
    name: 'SwitchPro',
  });
  const props = withDefaults(defineProps<SwitchPro>(), {
    bordered: true,
    placeholder: '请输入',
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
    checkedValue: 1,
    unCheckedValue: 0,
  });
  const omitProps = computed(() =>
    omit(props, 'onUpdate:checked', 'beforeValue', 'afterChange'),
  );
  const { valueGetter, valueSetter } = useValue(props.prop);
  const innerValue = computed(() =>
    props.beforeValue(props.checked ?? (props.model && valueGetter(props.model))),
  );
  const emit = defineEmits<{
    'update:checked': [val: any];
  }>();
  const updateValueHandler = (val: any) => {
    const _n = props.afterChange(val);
    emit('update:checked', _n);
    props.model && valueSetter(props.model, _n);
  };
</script>

<style lang="scss">
  @import './index.scss';
</style>
