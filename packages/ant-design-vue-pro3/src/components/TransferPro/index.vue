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
          <slot name="render" v-bind="item">
            {{ props.render ? props.render(item) : item.title }}
          </slot>
        </div>
        <span class="handle">
          <Handle v-if="props.sortable.type === 'drag'" />
          <template v-else>
            <ArrowUpOutlined
              class="icon"
              @click.stop="(e) => handleMove('up', e)"
            /><ArrowDownOutlined
              class="icon"
              @click.stop="(e) => handleMove('down', e)"
            />
          </template>
        </span>
      </div>
    </template>
  </AntTransfer>
</template>

<script setup lang="ts">
  import { ref, computed, watchEffect, type PropType, nextTick, watch } from 'vue';
  import { Transfer as AntTransfer } from 'ant-design-vue';
  import { transferProps } from 'ant-design-vue/es/transfer';
  import { useFetch } from '../../hooks/fetch';
  import { useValue } from '../../hooks/value';
  import Handle from './Handle.vue';
  import Sortable from 'sortablejs';
  import { merge, omit } from 'lodash';
  import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue';
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
        type: 'btn', // 'btn'| 'drag'
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
  const defaultProps = {
    showSelectAll: true,
    filterOption: (inputValue: string, option: any) => {
      return option.title.indexOf(inputValue) > -1;
    },
  };
  const transfer = ref<InstanceType<typeof AntTransfer>>();
  const omitProps = computed(() =>
    omit(
      merge(defaultProps, props),
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
  watch([() => props.dataSource, () => fetchDataSource.value], (v) => {
    const [pS, fS] = v;
    if (pS.length) {
      innerDataSource.value = pS;
    } else if (fS.length) {
      innerDataSource.value = fS;
    }
  });
  watchEffect(() => {
    if (innerDataSource.value.length) {
      nextTick(initSearch);
    }
  });
  let leftSortInstance, rightSortInstance;
  function initSearch() {
    if (!transfer.value) return;
    const handleOps = {
      handle: props.sortable.type === 'drag' ? '.handle' : void 0,
    };
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
        ...handleOps,
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
        ...handleOps,
        onEnd(evt) {
          const sortedKeys = Array.from<HTMLElement>(evt.to.children).map(
            (el) => (el.children[1].children[0] as HTMLElement).dataset.key,
          );
          updateValueHandler(sortedKeys);
        },
      });
    }
  }
  const handleMove = (type: 'up' | 'down', ev: Event) => {
    const moveTarget = findParent(ev.target, (el) => {
      return el?.classList?.contains('ant-transfer-list-content-item');
    });
    if (type === 'up' && moveTarget.previousElementSibling) {
      const pre = moveTarget.previousElementSibling;
      pre.before(moveTarget);
    } else {
      const next = moveTarget.nextElementSibling;
      next.after(moveTarget);
    }
    const sortedKeys = Array.from<HTMLElement>(moveTarget.parentElement.children).map(
      (el) => (el.children[1].children[0] as HTMLElement).dataset.key,
    );
    updateValueHandler(sortedKeys);
  };
  function findParent(node: Element, callback: (el: Element) => boolean) {
    let result: Element = node;
    do {
      if (callback(result)) break;
    } while ((result = result.parentElement));
    return result === node ? null : result;
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
    const _n = props.afterChange!(val, innerDataSource.value);
    emit('update:targetKeys', _n);
    props.model && valueSetter(props.model, _n);
  };
</script>

<style lang="scss">
  @import './index.scss';
</style>
