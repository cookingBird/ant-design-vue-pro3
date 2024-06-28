<template>
  <a-checkbox
    v-bind="omitProps"
    class="checkbox-pro"
    :checked="value"
    :onUpdate:checked="updateValueHandler"
  >
    <slot></slot>
  </a-checkbox>
</template>

<script setup lang="ts">
  import type { CheckboxPro } from '.';
  import { useValue } from '../../hooks/value';
  import { omit, isPresent } from '../../tools/tool';
  defineOptions({
    name: 'CheckboxPro',
  });
  const props = withDefaults(defineProps<CheckboxPro>(), {
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
    checked: undefined,
  });

  const omitProps = computed(() => omit(props, 'beforeValue', 'afterChange'));
  const { valueGetter, valueSetter } = useValue(props.prop);
  const innerChecked = ref(false);
  const value = computed(() => {
    const { checked, model, beforeValue } = props;

    const _n = beforeValue(
      isPresent(checked)
        ? checked
        : isPresent(model)
        ? valueGetter(model)
        : innerChecked.value,
    );
    return _n;
  });

  const emit = defineEmits<{
    'update:checked': [val: any];
  }>();
  const updateValueHandler = (val: any) => {
    const _n = props.afterChange(val);
    emit('update:checked', _n);
    props.model && valueSetter(props.model, _n);
    innerChecked.value = _n as boolean;
  };
</script>

<style scoped></style>
