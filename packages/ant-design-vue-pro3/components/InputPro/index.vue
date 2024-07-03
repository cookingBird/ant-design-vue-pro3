<template>
  <Input
    ref="input"
    v-bind="omitProps"
    :value="value"
    :disabled="innerDisabled"
    @update:value="updateValueHandler"
  >
    <template v-if="$slots.addonAfter" #addonAfter>
      <slot name="addonAfter"> </slot>
    </template>
    <template v-if="$slots.addonBefore" #addonBefore>
      <slot name="addonBefore"> </slot>
    </template>
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix"> </slot>
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix"> </slot>
    </template>
  </Input>
</template>

<script setup lang="ts">
  import { Input } from 'ant-design-vue';
  import type { InputPro } from '.';
  import { omit } from '../../tools/tool';
  import { useValue } from '../../hooks/value';
  defineOptions({
    name: 'InputPro',
  });
  const props = withDefaults(defineProps<InputPro>(), {
    bordered: true,
    placeholder: '请输入',
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
    type: 'text',
    size: 'middle',
    autocomplete: 'off',
  });
  console.log('input prop props', props);
  const omitProps = computed(() =>
    omit(props, 'onUpdate:value', 'beforeValue', 'afterChange', 'model'),
  );
  const innerDisabled = computed(() => props.disabled ?? props.readonly);
  const { valueGetter, valueSetter } = useValue(props.prop);
  const value = computed(() =>
    props.beforeValue(props.value ?? (props.model && valueGetter(props.model))),
  );
  const emit = defineEmits<{
    'update:value': [val: any];
  }>();
  const updateValueHandler = (val: any) => {
    const _n = props.afterChange(val);
    emit('update:value', _n);
    props.model && valueSetter(props.model, _n);
  };
  const input = ref<InstanceType<typeof Input>>();
  onMounted(() => {
    const rootEl: HTMLElement | undefined = input.value?.$el;

    const addon = Array.from(rootEl?.querySelectorAll('.ant-input-group-addon') ?? []);
    const before = addon[0];
    if (props.addonBefore && props.addonBeforeClick && before) {
      before.addEventListener('click', () => {
        props.addonBeforeClick?.();
      });
      before.setAttribute('style', 'cursor:pointer');
    }
    const after = addon[1];
    if (props.addonBefore && props.addonAfterClick && after) {
      after.addEventListener('click', () => {
        props.addonAfterClick?.();
      });
      after.setAttribute('style', 'cursor:pointer');
    }
  });
</script>

<style>
  @import './index.scss';
</style>
