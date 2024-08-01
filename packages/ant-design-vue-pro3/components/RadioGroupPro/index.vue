<template>
  <radio-group
    v-bind="omitProps"
    :value="value"
    @update:value="updateValueHandler"
  ></radio-group>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { RadioGroup } from 'ant-design-vue';
  import type { RadioGroupPro } from './index.d.ts';
  import { omit } from '../../tools/tool';
  import { useValue } from '../../hooks/value';
  const props = withDefaults(defineProps<RadioGroupPro>(), {
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
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
