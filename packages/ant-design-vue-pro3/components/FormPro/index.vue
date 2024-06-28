<template>
  <ant-form
    ref="form"
    class="form-pro"
    v-bind="formProps"
    :model="model"
    :data-style="styled"
  >
    <row-pro v-if="options.row" v-bind="options.row" :gutter="options.row.gutter ?? 12">
      <template v-for="(item, index) in options.columns" :key="index">
        <col-pro
          v-if="callValue(item.if, (val) => val(model))"
          v-show="callValue(item.show, (val) => val(model))"
          v-bind="item.col"
        >
          <form-item-pro v-bind="item.formItemProps">
            <slot :name="_buildName(item)" :option="item" :model="model">
              <TypeNode :options="_buildSlotProps(item)" :model="model"> </TypeNode>
              <row-pro
                v-if="item.children"
                v-bind="item.children.row"
                :gutter="item.children.row?.gutter ?? 12"
              >
                <template v-for="(_item, index) in item.children.columns" :key="index">
                  <col-pro
                    v-if="callValue(_item.if, (val) => val(model))"
                    v-show="callValue(_item.show, (val) => val(model))"
                    v-bind="_item.col"
                  >
                    <form-item-pro
                      :labelCol="item.children.labelCol ?? labelCol"
                      :labelAlign="item.children.labelAlign ?? labelAlign"
                      :colon="item.children.colon ?? colon"
                      v-bind="_item.formItemProps"
                    >
                      <TypeNode :options="_buildSlotProps(_item)" :model="model">
                      </TypeNode>
                    </form-item-pro>
                  </col-pro>
                </template>
              </row-pro>
            </slot>
          </form-item-pro>
        </col-pro>
      </template>
    </row-pro>
    <template v-for="item in options.columns" v-else>
      <form-item-pro v-bind="item.formItemProps">
        <slot :name="_buildName(item)" :option="item" :model="model">
          <TypeNode :options="_buildSlotProps(item)" :model="model"> </TypeNode>
        </slot>
      </form-item-pro>
    </template>
    <slot></slot>
  </ant-form>
</template>

<script setup lang="ts">
  import { omit } from '../../tools/tool';
  import type { FormProProps, FormItemProOptions } from './index.d';
  import { callValue } from '../../tools/visible';
  import TypeNode from '../TypeNode/index.vue';
  import { defineExpose, ref } from 'vue';
  import { Form as AntForm } from 'ant-design-vue';
  defineOptions({
    name: 'AFormPro',
    inheritAttrs: true,
  });
  const props = withDefaults(defineProps<FormProProps>(), {
    styled: 'default',
    labelAlign: 'right',
    colon: true,
  });

  const formProps = computed(() =>
    omit({ ...props, ...props.options }, 'columns', 'row', 'options'),
  );
  console.log('form pro props', formProps);
  function _buildName(options: FormItemProOptions) {
    const { prop: _prop1, name: _name1 } = options.formItemProps;
    const { prop = _prop1, name = _name1 } = options;
    let _prop;
    if (prop) {
      if (Array.isArray(prop)) {
        _prop = prop;
      } else if (typeof prop === 'string') {
        _prop = prop.split('.');
      }
    }
    if (name) {
      if (Array.isArray(name)) {
        _prop = prop;
      } else if (typeof name === 'string') {
        _prop = name.split('.');
      }
    }
    return _prop;
  }
  function _buildSlotProps(options: FormItemProOptions) {
    const { formItemProps } = options;
    return {
      ...options,
      name: formItemProps.name ?? options.name,
      prop: formItemProps.prop ?? options.prop,
    };
  }
  const form = ref<InstanceType<typeof AntForm>>();
  defineExpose({
    formRef: form,
    // @ts-expect-error
    validate: (...args) => form.value.validate(...args),
    // @ts-expect-error
    validateFields: (...args) => form.value.validateFields(...args),
    // @ts-expect-error
    clearValidate: (...args) => form.value.clearValidate(...args),
    // @ts-expect-error
    resetFields: (...args) => form.value.resetFields(...args),
    // @ts-expect-error
    scrollToField: (...args) => form.value.scrollToField(...args),
  });
</script>

<style>
  @import './index.scss';
</style>
