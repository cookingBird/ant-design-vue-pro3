<template>
  <Tabs
    v-bind="omitProps"
    class="tabs-pro"
    :data-height="props.height"
    :activeKey="internalActiveKey"
    @update:active-key="onUpdateActiveKey"
  >
    <template v-for="pane in panes" :key="pane.key ?? pane.tab">
      <TabPane v-bind="omitComponent(pane)">
        <component :is="pane.component"></component>
      </TabPane>
    </template>
  </Tabs>
</template>

<script setup lang="ts">
  import { ref, computed, watch, type PropType } from 'vue';
  import { Tabs, TabPane, type TabPaneProps } from 'ant-design-vue';
  import { useScopedSessionStorage } from '@easy/common-hooks';
  import { omit } from '../../tools/tool';
  import { tabsProps } from 'ant-design-vue/es/tabs/src/Tabs';
  import { merge } from 'lodash';
  const props = defineProps({
    ...tabsProps(),
    height: { type: String, default: 'full' },
    useRoute: { type: Boolean, default: true },
    panes: Array as PropType<TabPaneProps & { key: string; component: any }[]>,
  });
  const defaultProps = {
    size: 'large',
  };
  const omitProps = computed(() =>
    omit(merge(defaultProps, props), 'panes', 'onUpdate:activeKey'),
  );

  const emit = defineEmits<{
    'update:activeKey': [val: string | number];
  }>();
  const activeTabKeyValue =
    props.useRoute ?
      useScopedSessionStorage(
        'activeTabKey',
        () => props.activeKey ?? props.panes![0]?.key,
      ).value
    : ref('');
  function onUpdateActiveKey(val: string | number) {
    emit('update:activeKey', val);
    activeTabKeyValue.value = val;
  }

  const omitComponent = (ops: { component: any }) => omit(ops, 'component');

  const internalActiveKey = useInternalActiveKey();
  function useInternalActiveKey() {
    const internalActiveKey = ref<string | undefined>(undefined);
    watch(
      () => activeTabKeyValue.value,
      (val) => {
        if (val) {
          internalActiveKey.value = val?.toString();
        }
      },
      { immediate: true },
    );

    watch(
      () => props.activeKey,
      (val) => {
        if (val) {
          internalActiveKey.value = val.toString();
        }
      },
      { immediate: true },
    );

    return internalActiveKey;
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
