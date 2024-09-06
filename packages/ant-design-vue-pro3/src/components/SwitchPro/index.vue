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
  import { useValue } from '../../hooks/value';
  import { omit } from 'lodash';
  defineOptions({
    name: 'SwitchPro',
  });
  const props = defineProps({
    ...switchProps(),
    // type convert
    beforeValue: {
      tyep: Function,
      default: () => (v) => v,
    },
    afterChange: {
      tyep: Function,
      default: () => (v) => v,
    },
    // data bind
    prop: String,
    model: Object,
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
