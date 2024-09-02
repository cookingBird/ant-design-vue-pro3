<template>
  <AntSwitch
    v-bind="omitProps"
    :checked="innerValue"
    @update:checked="updateValueHandler"
  ></AntSwitch>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { Switch as AntSwitch } from 'ant-design-vue';
  import { switchProps } from 'ant-design-vue/es/switch';
  import { omit } from '../../tools/tool';
  import { useValue } from '../../hooks/value';
  defineOptions({
    name: 'SwitchPro',
  });
  const props = defineProps({
    ...switchProps(),
    beforeValue: {
      tyep: Function,
      default: () => (v) => v,
    },
    afterChange: {
      tyep: Function,
      default: () => (v) => v,
    },
    prop: String,
    model: Object,
  });
  const defaultProps = {
    bordered: true,
    placeholder: '请输入',
    checkedValue: 1,
    unCheckedValue: 0,
  };

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
