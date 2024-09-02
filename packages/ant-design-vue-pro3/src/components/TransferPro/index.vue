<template>
  <AntTransfer
    ref="transfer"
    v-bind="omitProps"
    :dataSource="innerDataSource"
    :targetKeys="targetKeys"
    class="transfer-pro"
    @update:targetKeys="updateValueHandler"
    @change="hanldeChange"
  >
    <template v-if="$slots.children" #children="slotProps">
      <slot name="children" v-bind="slotProps"> </slot>
    </template>
    <template #render="item">
      <div class="ant-transfer-list-content-item-text__item" :data-key="item.key">
        <div class="content">
          <slot name="render" v-bind="item"> {{ props.render ? props.render(item):item.title }} </slot>
        </div>
        <span class="handle">
          <Handle />
        </span>
      </div>
    </template>
  </AntTransfer>
</template>

<script setup lang="ts">
  import { ref, computed, watchEffect, type PropType, nextTick,watch } from 'vue';
  import { Transfer as AntTransfer } from 'ant-design-vue';
  import { transferProps } from 'ant-design-vue/es/transfer';
  import { useFetch } from '../../hooks/fetch';
  import { omit } from '../../tools/tool';
  import { useValue } from '../../hooks/value';
  import Handle from './Handle.vue';
  import Sortable from 'sortablejs';
  defineOptions({
    name: 'TransferPro',
  });
  const props = defineProps({
    ...transferProps(),
    sortable: {
      type: Object,
      default: () => ({
        left: false,
        right: true,
      }),
    },
    // effected remote data
    effectKeys: [String, Array],
    fetch: Function as PropType<
      (
        model: any,
      ) => Promise<{ label: string; value: string | number; [key: string]: any }[]>
    >,
    // data bind
    model: Object,
    prop: String,
    // value convert
    beforeValue: {
      type: Function,
      default: (v) => v,
    },
    afterChange: {
      type: Function,
      default: (v) => v,
    },
  });
  const d = {
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
  };
  const transfer = ref<InstanceType<typeof AntTransfer>>();
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
  const fetchDataSource = ref<any[]>([]);
  if (props.fetch) {
    const { result } = useFetch(
      props.fetch,
      computed(() => props.model),
      props.effectKeys as string[],
    );
    watchEffect(() => {
      fetchDataSource.value = result.value;
    });
  }
  const innerDataSource = ref([]);
  watch([()=>props.dataSource,()=>fetchDataSource.value],(v)=>{
    const [pS,fS] = v;
    if(pS.length){
      // @ts-expect-error
      innerDataSource.value = pS;
    }else if(fS.length){
      // @ts-expect-error
      innerDataSource.value = fS;
    }
  })
  watchEffect(() => {
    console.log('transfer innerDataSource',innerDataSource.value)
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

  const hanldeChange = () => {
    nextTick(initSearch);
  };

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

<style lang="scss">
  @import './index.scss';
</style>
