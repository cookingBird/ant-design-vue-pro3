<template>
  <InputNumber
    ref="input"
    v-bind="omitProps"
    :value="value"
    :disabled="innerDisabled"
    class="inputNumber-pro"
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
  </InputNumber>
</template>

<script setup lang="ts">
  import { ref, computed, watch, watchEffect, useAttrs, onMounted } from 'vue';
  import { InputNumber } from 'ant-design-vue';
  import { inputNumberProps } from 'ant-design-vue/es/input-number/index.js';
  import { omit } from '../../tools/tool';
  import { useValue } from '../../hooks/value';
  defineOptions({
    name: 'InputNumberPro',
  });
  const props = defineProps({
    ...inputNumberProps(),
    // type converter
    beforeValue: {
      type: Function,
      default: () => (v) => v,
    },
    afterChange: {
      type: Function,
      default: () => (v) => v,
    },
    // data bind
    prop: String,
    model: Object,
    // addon custom
    addonBeforeClick: Function,
    addonAfterClick: Function,
  });

  const omitProps = computed(() =>
    omit(props, 'onUpdate:value', 'beforeValue', 'afterChange'),
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
  const input = ref<InstanceType<typeof InputNumber>>();
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
  /* @import './index.scss'; */
</style>
