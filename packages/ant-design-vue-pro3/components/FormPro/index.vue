<template>
  <a-form ref="form" v-bind="omit(options, 'columns')" :model="model">
    <template v-for="item in options.columns" :key="item.prop || item.name">
      <a-form-item
        v-if="callValue(item.if, (val:any) => val(model))"
        v-show="callValue(item.show, (val:any) => val(model))"
        :label="item.label"
        :name="_buildName(item)"
        :class="item.class"
        :style="item.style"
      >
        <type-node v-bind="omit($attrs, 'class', 'style')" :options="item" :model="model">
        </type-node>
      </a-form-item>
    </template>
  </a-form>
</template>

<script setup lang="ts">
  import { omit } from '../../tools/tool';
  import type { FormPropOptions } from '.';
  import { callValue } from '../../tools/visible';
  import TypeNode from '../TypeNode/index.vue';
  import { defineExpose, ref } from 'vue';
  import { Form as AForm, FormItem as AFormItem } from 'ant-design-vue';
  defineOptions({
    name: 'AFormPro',
  });
  withDefaults(
    defineProps<{
      options: FormPropOptions<Record<string, any>>;
      model: Object;
    }>(),
    {},
  );

  function _buildName(options: FormPropOptions<Record<string, any>>['columns'][number]) {
    const { prop, name } = options;
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
  const form = ref(null);

  defineExpose({
    formRef: form,
  });
</script>

<style>
  @import './index.css';
</style>
