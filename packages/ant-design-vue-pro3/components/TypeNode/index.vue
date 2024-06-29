<template>
  <div v-if="options.slotIs" v-bind="options.wrapperProps" :prop="generalProp" wrapper>
    <input-pro
      v-if="callFunction(options.slotIs, model) === 'input'"
      v-bind="options.slotProps"
      :prop="options.name ?? options.prop"
      :model="model"
    >
    </input-pro>
    <radio-group-pro
      v-else-if="callFunction(options.slotIs, model) === 'radioGroup'"
      v-bind="options.slotProps"
      :prop="options.name ?? options.prop"
      :model="model"
    >
    </radio-group-pro>
    <textarea-pro
      v-if="callFunction(options.slotIs, model) === 'textarea'"
      v-bind="options.slotProps"
      :prop="options.name ?? options.prop"
      :model="model"
    >
    </textarea-pro>

    <select-pro
      v-else-if="callFunction(options.slotIs, model) === 'select'"
      v-bind="options.slotProps"
      :model="model"
      :prop="options.name ?? options.prop"
    >
    </select-pro>
    <button-group-pro
      v-else-if="callFunction(options.slotIs, model) === 'buttonGroup'"
      v-bind="options.slotProps"
      :model="model"
      :prop="options.name ?? options.prop"
    >
    </button-group-pro>
    <date-picker-pro
      v-else-if="callFunction(options.slotIs, model) === 'datePicker'"
      v-bind="options.slotProps"
      :model="model"
      :prop="options.name ?? options.prop"
    />
    <date-range-picker-pro
      v-else-if="callFunction(options.slotIs, model) === 'dateRangePicker'"
      v-bind="options.slotProps"
      :model="model"
      :prop="options.name ?? options.prop"
    />
    <transfer-pro
      v-else-if="callFunction(options.slotIs, model) === 'transfer'"
      v-bind="options.slotProps"
      :model="model"
      :prop="options.name ?? options.prop"
    />
    <Switch
      v-else-if="callFunction(options.slotIs, model) === 'switch'"
      :options="options"
      v-bind="options.slotProps"
      :value="valueGetter(model)"
      @update:value="(e) => valueSetter(model, e)"
    >
    </Switch>
    <InputNumber
      v-else-if="callFunction(options.slotIs, model) === 'inputNumber'"
      :value="valueGetter(model)"
      v-bind="options.slotProps"
      @update:value="(e) => valueSetter(model, e)"
    >
    </InputNumber>
    <Cascader
      v-else-if="callFunction(options.slotIs, model) === 'cascader'"
      v-bind="options.slotProps"
      :value="valueGetter(model)"
      @update:value="(e) => valueSetter(model, e)"
    >
    </Cascader>
  </div>
</template>

<script setup lang="ts">
  /* eslint-disable vue/valid-define-emits */
  import { InputNumber, Switch, Cascader } from 'ant-design-vue';
  import type { TypeNodeProp } from '.';
  import { useValue } from '../../hooks/value';
  import { computed } from 'vue';
  import ButtonGroupPro from '../ButtonGroupPro/index.vue';
  import DatePickerPro from '../DatePickerPro/index.vue';
  import DateRangePickerPro from '../DateRangePickerPro/index.vue';
  import { callFunction } from '../../tools/tool';
  import TransferPro from '../TransferPro/index.vue';
  defineOptions({
    name: 'TypeNode',
  });

  const props = defineProps<{
    options: TypeNodeProp;
    model: any;
  }>();

  const emits = defineEmits();
  const { valueGetter, valueSetter } = useValue(props.options.name || props.options.prop);
  const generalProp = computed(() => _buildPropTag(props.options));

  function _buildPropTag(options: TypeNodeProp) {
    const p = options.name || options.prop;
    let propTag;
    if (Array.isArray(p)) {
      propTag = p.join('.');
    } else if (typeof p === 'string') {
      propTag = p;
    } else {
      console.warn('TypeNode _buildPropTag fn name|prop is empty');
      propTag = '';
    }
    return propTag;
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
