<template>
  <div
    :prop="generalProp"
    :required="options.required"
    wrapper
    v-bind="options.wrapperProps"
  >
    <Input
      v-if="callFunction(options.slotIs, model) === 'input'"
      :value="beforeGetter ? beforeGetter(valueGetter(model), model) : valueGetter(model)"
      v-bind="options.slotProps"
      @update:value="
        (e) => {
          beforeSetter
            ? valueSetter(model, beforeSetter(e, model))
            : valueSetter(model, e);
        }
      "
      v-on="buildListeners($attrs, options, emits, null, model, generalProp)"
    >
    </Input>
    <InputNumber
      v-else-if="callFunction(options.slotIs, model) === 'inputNumber'"
      :value="beforeGetter ? beforeGetter(valueGetter(model), model) : valueGetter(model)"
      v-bind="options.slotProps"
      @update:value="
        (e) => {
          beforeSetter
            ? valueSetter(model, beforeSetter(e, model))
            : valueSetter(model, e);
        }
      "
      v-on="buildListeners($attrs, options, emits, null, model, generalProp)"
    >
    </InputNumber>
    <Select
      v-else-if="callFunction(options.slotIs, model) === 'select'"
      :value="beforeGetter ? beforeGetter(valueGetter(model), model) : valueGetter(model)"
      :options="fetchOps"
      v-bind="omit(options.slotProps, 'options', 'fetch', 'on')"
      @update:value="
        (e) => {
          beforeSetter
            ? valueSetter(model, beforeSetter(e, model))
            : valueSetter(model, e);
        }
      "
      v-on="buildListeners($attrs, options, emits, null, model, generalProp)"
    >
    </Select>
    <Switch
      v-else-if="callFunction(options.slotIs, model) === 'switch'"
      :value="beforeGetter ? beforeGetter(valueGetter(model), model) : valueGetter(model)"
      :options="options"
      v-bind="options.slotProps"
      @update:value="
        (e) => {
          beforeSetter
            ? valueSetter(model, beforeSetter(e, model))
            : valueSetter(model, e);
        }
      "
      v-on="buildListeners($attrs, options, emits, null, model, generalProp)"
    >
    </Switch>
    <RadioGroup
      v-else-if="callFunction(options.slotIs, model) === 'radioGroup'"
      :value="beforeGetter ? beforeGetter(valueGetter(model), model) : valueGetter(model)"
      v-bind="options.slotProps"
      @update:value="
        (e) => {
          beforeSetter
            ? valueSetter(model, beforeSetter(e, model))
            : valueSetter(model, e);
        }
      "
      v-on="buildListeners($attrs, options, emits, null, model, generalProp)"
    >
    </RadioGroup>
    <Cascader
      v-else-if="callFunction(options.slotIs, model) === 'cascader'"
      :value="beforeGetter ? beforeGetter(valueGetter(model), model) : valueGetter(model)"
      v-bind="options.slotProps"
      @update:value="
        (e) => {
          beforeSetter
            ? valueSetter(model, beforeSetter(e, model))
            : valueSetter(model, e);
        }
      "
      v-on="buildListeners($attrs, options, emits, null, model, generalProp)"
    >
    </Cascader>
    <button-group
      v-else-if="callFunction(options.slotIs, model) === 'buttonGroup'"
      :options="options.slotProps"
      :model="{ ...model, prop: generalProp }"
      v-bind="$attrs"
      v-on="buildListeners($attrs, options, emits, null, model, generalProp)"
    >
    </button-group>
  </div>
</template>

<script setup lang="ts">
  import {
    Input,
    InputNumber,
    Select,
    Switch,
    RadioGroup,
    Cascader,
  } from 'ant-design-vue';
  import type { SlotFormItem, TypeNodeProp } from '.';
  import { useValue } from '../../hooks/value';
  import { computed } from 'vue';
  import ButtonGroup from '../ButtonGroupPro/index.vue';
  import { callFunction, omit } from '../../tools/tool';
  import { buildListeners } from '../../tools/event';
  import { useFetch } from '../../hooks/fetch';
  defineOptions({
    name: 'TypeNode',
  });

  const props = defineProps<{
    options: TypeNodeProp;
    model: any;
  }>();

  const emits = defineEmits([]);
  const { valueGetter, valueSetter } = useValue(props.options.name || props.options.prop);
  const beforeGetter = computed(() => props.options.beforeGetter);
  const beforeSetter = computed(() => props.options.beforeSetter);
  const generalProp = computed(() => _buildPropTag(props.options));

  const { result } = useFetch(props.model, props.options);
  const fetchOps = computed(
    () => callFunction(props.options.slotProps?.options, props.model) || result,
  );

  function _buildPropTag(options: SlotFormItem) {
    const p = options.name || options.prop;
    let propTag;
    if (Array.isArray(p)) {
      propTag = p.join('.');
    } else if (typeof p === 'string') {
      propTag = p;
    } else {
      throw Error('prop[name] type error');
    }
    return propTag;
  }
</script>
