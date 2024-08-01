<template>
  <AntTextarea
    v-bind="omitProps"
    :value="value"
    :placeholder="props.placeholder"
    @update:value="updateValueHandler"
  ></AntTextarea>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, watchEffect, useAttrs, onMounted } from 'vue';
  import { Textarea as AntTextarea } from 'ant-design-vue';
  import type { TextAreaPro } from './index.d';
  import { useValue } from '../../hooks/value';
  import { omit } from '../../tools/tool';

  const props = withDefaults(defineProps<TextAreaPro>(), {
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
    placeholder: '请输入',
    bordered: true,
  });
  const omitProps = computed(() =>
    omit(props, 'onUpdate:value', 'beforeValue', 'afterChange'),
  );
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

<style scoped></style>
