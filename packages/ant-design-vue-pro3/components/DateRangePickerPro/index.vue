<template>
  <AntRangePicker
    v-bind="omitProps"
    :value="value"
    class="date-range-picker-pro"
    @update:value="updateValueHandler"
  >
    <template v-if="$slots.dateRender" #dateRender="slotProps">
      <slot name="dateRender" v-bind="slotProps"></slot>
    </template>
    <template v-if="$slots.prevIcon" #prevIcon>
      <slot name="prevIcon"></slot>
    </template>
    <template v-if="$slots.suffixIcon" #suffixIcon>
      <slot name="suffixIcon"></slot>
    </template>
    <template v-if="$slots.superNextIcon" #superNextIcon>
      <slot name="superNextIcon"></slot>
    </template>
    <template v-if="$slots.superPrevIcon" #superPrevIcon>
      <slot name="superPrevIcon"></slot>
    </template>
  </AntRangePicker>
</template>

<script setup lang="ts">
  import { computed, useAttrs } from 'vue';
  import { RangePicker as AntRangePicker } from 'ant-design-vue';
  import type { DateRangePickerPro } from '.';
  import { useValue } from '../../hooks/value';
  import { omit } from '../../tools/tool';
  const props = withDefaults(defineProps<DateRangePickerPro>(), {
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
  });
  const attrs = useAttrs();
  const omitProps = computed(() =>
    omit({ ...attrs, ...props }, 'model', 'prop', 'beforeValue', 'afterChange'),
  );

  const { valueGetter, valueSetter } = useValue(props.prop);
  const value = computed(
    () => props.beforeValue!(attrs.value ?? valueGetter(props.model)) as [string, string],
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
