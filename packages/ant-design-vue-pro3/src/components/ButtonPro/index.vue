<template>
  <Button
    v-bind="omitProps"
    :loading="loading"
    :onClick="clickHandler"
    :data-active="props.active"
    class="button-pro"
  >
    <a-popconfirm v-if="props.confirm" v-bind="props.confirm">
      <slot> {{ label }} </slot>
    </a-popconfirm>
    <slot v-else> {{ label }} </slot>
  </Button>
</template>

<script setup lang="ts">
  import { ref, computed, watch, watchEffect } from 'vue';
  import { Button } from 'ant-design-vue';
  import useLoading from '../../hooks/loading';
  import type { ButtonPro } from '.';
  import { omit } from '../../tools/tool';
  const { loading, done } = useLoading();

  defineOptions({
    name: 'ButtonPro',
    inheritAttrs: false,
  });

  const props = withDefaults(defineProps<ButtonPro>(), {
    model: null,
    active: false,
  });

  // omit passive onClick event
  const omitProps = computed(() => omit(props, 'onClick', 'model', 'confirm'));
  function clickHandler() {
    loading.value = true;
    props.onClick?.(done, props.model);
  }
</script>

<style>
  @import './index.scss';
</style>
