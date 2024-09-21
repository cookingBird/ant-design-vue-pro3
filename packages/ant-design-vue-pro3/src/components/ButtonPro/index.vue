<template>
  <Button
    v-bind="omitProps"
    :loading="loading"
    :onClick="clickHandler"
    :data-active="props.active"
    class="button-pro"
  >
    <Popconfirm v-if="props.confirm" v-bind="props.confirm">
      <slot> {{ label }} </slot>
    </Popconfirm>
    <slot v-else> {{ label }} </slot>
  </Button>
</template>

<script setup lang="ts">
  import { computed, type PropType } from 'vue';
  import { Button, Popconfirm, type PopconfirmProps } from 'ant-design-vue';
  import useLoading from '../../hooks/loading';
  import { omit } from '../../tools/tool';
  import { buttonProps } from 'ant-design-vue/lib/button/button';

  const { loading, done } = useLoading();

  defineOptions({
    name: 'ButtonPro',
    inheritAttrs: true,
  });

  const props = defineProps({
    ...buttonProps(),
    model: Object,
    active: Boolean,
    label: String,
    confirm: Object as PropType<PopconfirmProps>,
    onClick: Function as PropType<(done: () => void, model?: any) => void>,
  });

  // omit passive onClick event
  const omitProps = computed(() => omit(props, 'onClick', 'model', 'confirm'));
  function clickHandler() {
    loading.value = true;
    props.onClick?.(done, props.model);
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
