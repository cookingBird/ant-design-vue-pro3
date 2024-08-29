<template>
  <AntTransfer
    ref="transfer"
    v-bind="omitProps"
    :dataSource="innerDataSource"
    :targetKeys="targetKeys"
    class="transfer-pro"
    @update:targetKeys="updateValueHandler"
  >
    <template v-if="$slots.children" #children="slotProps">
      <slot name="children" v-bind="slotProps"> </slot>
    </template>
    <template #render="item">
      <div class="ant-transfer-list-content-item-text__item" :data-key="item.key">
        <div class="content">
          <slot name="render" v-bind="item"> {{ props.render(item) }} </slot>
        </div>
        <span class="handle">
          <Handle />
        </span>
      </div>
    </template>
  </AntTransfer>
</template>

<script setup lang="ts">
  import { ref, computed, watchEffect, onMounted, nextTick } from 'vue';
  import { Transfer as AntTransfer } from 'ant-design-vue';
  import { type TransferPropsPro } from '.';
  import { useFetch } from '../../hooks/fetch';
  import { omit } from '../../tools/tool';
  import { useValue } from '../../hooks/value';
  import Handle from './Handle.vue';
  import Sortable from 'sortablejs';
  defineOptions({
    name: 'TransferPro',
  });
  const props = withDefaults(defineProps<TransferPropsPro>(), {
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
    render: () => (item: any) => item.title,
    showSelectAll: true,
    locale: () => ({
      titles: [],
      notFoundContent: '列表为空',
      searchPlaceholder: '请输入搜索内容',
      itemUnit: '项',
      itemsUnit: '项',
      remove: '移除',
      selectAll: '全选所有',
      selectCurrent: '全选当页',
      selectInvert: '反选当页',
      removeAll: '取消全选',
      removeCurrent: '取消当页全选',
    }),
    sortable: () => ({
      left: false,
      right: false,
    }),
  });
  const transfer = ref(null);
  const omitProps = computed(() =>
    omit(
      props,
      'model',
      'fetch',
      'beforeValue',
      'afterChange',
      'onUpdate:targetKeys',
      'effectKeys',
      'prop',
      'render',
    ),
  );
  const fetchDataSource = ref([]);
  if (props.fetch) {
    const { result } = useFetch(
      props.fetch,
      computed(() => props.model),
      props.effectKeys,
    );
    watchEffect(() => {
      fetchDataSource.value = result.value;
    });
  }
  const innerDataSource = computed(() => props.dataSource ?? fetchDataSource.value);
  watchEffect(() => {
    if (innerDataSource.value.length) {
      nextTick(initSearch);
    }
  });
  let leftSortInstance, rightSortInstance;
  function initSearch() {
    if (!transfer.value) return;
    const [left, right] = Array.from(
      (transfer.value.$el as HTMLElement).querySelectorAll('.ant-transfer-list-content'),
    );
    if (props.sortable.left && left) {
      leftSortInstance?.destroy();
      const list: HTMLElement[] = Array.from(
        left.querySelectorAll(
          '.ant-transfer-list-content-item-text>.ant-transfer-list-content-item-text__item',
        ),
      );
      list.forEach((el) => {
        const [content, handle] = Array.from(el.children);
        content.classList.add('content--drag');
        handle.classList.add('handle--visible');
      });
      leftSortInstance = Sortable.create(left, {
        handle: '.handle',
      });
    }
    if (props.sortable.right && right) {
      rightSortInstance?.destroy();
      const list: HTMLElement[] = Array.from(
        right.querySelectorAll(
          '.ant-transfer-list-content-item-text>.ant-transfer-list-content-item-text__item',
        ),
      );
      list.forEach((el) => {
        const [content, handle] = Array.from(el.children);
        content.classList.add('content--drag');
        handle.classList.add('handle--visible');
      });
      rightSortInstance = Sortable.create(right, {
        handle: '.handle',
        onEnd(evt) {
          const sortedKeys = Array.from<HTMLElement>(evt.to.children).map(
            (el) => (el.children[1].children[0] as HTMLElement).dataset.key,
          );
          updateValueHandler(sortedKeys);
        },
      });
    }
  }

  // bind model
  const { valueGetter, valueSetter } = useValue(props.prop);
  const targetKeys = computed(() =>
    props.beforeValue!(props.targetKeys ?? valueGetter(props.model)),
  );
  const emit = defineEmits<{
    'update:targetKeys': [val: any];
  }>();
  const updateValueHandler = (val: any) => {
    const _n = props.afterChange!(val);
    emit('update:targetKeys', _n);
    props.model && valueSetter(props.model, _n);
  };
</script>

<style>
  @import './index.scss';
</style>
