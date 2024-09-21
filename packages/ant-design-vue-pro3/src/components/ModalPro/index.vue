<template>
  <ConfigProvider :locale="props.locale">
    <AntModal
      v-bind="omitProps"
      v-model:visible="visible"
      class="modal-pro"
      :style="props.style"
      :class="`modal-pro--${styled} ${props.class}`"
      :confirmLoading="loading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template v-if="$slots.title" #title>
        <slot name="title"> </slot>
      </template>
      <template v-if="$slots.default" #default>
        <slot name="default"> </slot>
      </template>
      <template v-if="$slots.footer" #footer>
        <slot name="footer"> </slot>
      </template>
    </AntModal>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ref, computed, useAttrs, type PropType } from 'vue';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import { Modal as AntModal, ConfigProvider } from 'ant-design-vue';
  import { type Locale } from 'ant-design-vue/es/locale-provider';
  import { modalProps } from 'ant-design-vue/es/modal/Modal.js';
  import { omit } from '../../tools/tool';
  import useLoading from '../../hooks/loading';
  import { merge } from 'lodash';
  defineOptions({
    inheritAttrs: false,
  });
  const attrs = useAttrs();
  const props = defineProps({
    ...modalProps(),
    styled: {
      type: String as PropType<'default' | 'transparent'>,
      default: 'default',
    },
    locale: {
      type: Object as PropType<Locale>,
      default: () => zhCN,
    },
    class: String,
    style: String,
    onOk: {
      type: Function as PropType<(done: () => void) => void>,
    },
  });
  const defaultProps = {
    closable: true,
    destroyOnClose: true,
    mask: true,
    title: '弹窗默认标题',
  };
  const emit = defineEmits<{
    'ok': [done: () => void];
    'update:visible': [v: boolean];
    'cancel': [];
  }>();
  const innerVisible = ref(true);
  const visible = computed<boolean>({
    get() {
      return props.visible ?? innerVisible.value;
    },
    set(val) {
      innerVisible.value = val;
      emit('update:visible', val);
    },
  });
  const { loading, done } = useLoading();
  const omitProps = computed(() =>
    omit(
      merge(defaultProps, props),
      'cancelButtonProps',
      'onOk',
      'onUpdate:visible',
      'onCancel',
    ),
  );
  function handleOk() {
    loading.value = true;
    props.onOk?.(done);
    // @ts-expect-error
    attrs._ok?.();
    // @ts-expect-error
    attrs._onConfirm?.();
  }
  function handleCancel() {
    // @ts-expect-error
    attrs._cancel?.();
    // @ts-expect-error
    attrs._close?.();
    emit('cancel');
  }
  defineExpose({
    close() {
      innerVisible.value = false;
    },
  });
</script>

<style lang="scss">
  @import './index.scss';
</style>
