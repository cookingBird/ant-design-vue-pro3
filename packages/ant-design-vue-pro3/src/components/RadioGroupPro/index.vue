<template>
  <RadioGroup v-bind="omitProps" :value="value" @update:value="updateValueHandler">
    <template v-for="item in props.options || []">
      <Radio v-bind="item" :value="item.alue"> {{ item.label }}</Radio>
    </template>
  </RadioGroup>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { RadioGroup, Radio } from 'ant-design-vue';
  import { radioGroupProps } from 'ant-design-vue/es/radio/Group';
  import { omit } from '../../tools/tool';
  import { useValue } from '../../hooks/value';
  const props = defineProps({
    ...radioGroupProps(),
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
  const emit = defineEmits<{
    'update:value': [val: any];
  }>();
  const omitProps = computed(() =>
    omit(props, 'onUpdate:value', 'beforeValue', 'afterChange'),
  );
  const { valueGetter, valueSetter } = useValue(props.prop);
  const value = computed(() =>
    props.beforeValue!(props.value ?? valueGetter(props.model)),
  );
  const updateValueHandler = (val: any) => {
    const _n = props.afterChange!(val);
    emit('update:value', _n);
    props.model && valueSetter(props.model, _n);
  };
</script>

<style scoped></style>
