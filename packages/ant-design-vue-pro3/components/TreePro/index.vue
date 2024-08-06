<template>
  <div class="tree-pro-wrapper" :data-size="props.size">
    <input-pro
      v-if="showSearcher"
      v-bind="inputProps.searchOptions"
      :value="inputProps.searchValue"
      :size="props.size"
      @update:value="modelValueHandler"
    >
      <template #prefix>
        <search-outlined />
      </template>
    </input-pro>
    <AntTree
      ref="treeRef"
      v-bind="treeProps"
      :expandedKeys="wrapperInnerExpandedKeys"
      :treeData="innerData"
      :onDrop="onDrop"
      @update:expandedKeys="handleUpdateExpandedKeys"
    >
      <template v-if="$slots.switcherIcon" #switcherIcon="slotProps">
        <slot name="switcherIcon" v-bind="slotProps"> </slot>
      </template>
      <template v-if="$slots.title" #title="slotProps">
        <slot name="title" v-bind="slotProps"> </slot>
      </template>
    </AntTree>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, watchEffect, useAttrs, onMounted } from 'vue';
  import InputPro from '../InputPro';
  import { Tree as AntTree } from 'ant-design-vue';
  import type { TreePro } from './index.d';
  import { omit, pick } from '../../tools/tool';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import getTreeTravel from '../../tools/getTreeTravel';
  import findSelfList from '../../tools/findSelfList';
  import type {
    AntTreeNodeDropEvent,
    TreeProps,
    TreeDataItem,
  } from 'ant-design-vue/lib/tree';
  import { useSessionStorage } from '@vueuse/core';

  defineOptions({
    name: 'TreePro',
    inheritAttrs: true,
  });

  const treeRef = ref<typeof AntTree | null>(null);
  const attrs = useAttrs();
  const props = withDefaults(defineProps<TreePro>(), {
    size: 'small',
    showSearcher: false,
    selectable: false,
    blockNode: true,
    draggable: false,
  });
  const emit = defineEmits<{
    'update:searchValue': [val: string];
    'click': [ev: MouseEvent, data: any];
    'rightClick': [ev: MouseEvent, data: any];
    'drop': [info: AntTreeNodeDropEvent, changeList: unknown[]];
  }>();
  const treeProps = computed(() =>
    omit({ ...attrs, ...props }, 'searchValue', 'searchOptions', 'size', 'onDrop'),
  );
  const inputProps = computed(() => pick(props, 'searchOptions', 'searchValue'));
  const modelValueHandler = (val: string) => {
    emit('update:searchValue', val);
  };

  const innerData = ref([] as any);

  // >>>>>>>>>>>>>> expand persistence
  const innerExpandedKeys = useSessionStorage(
    'treeExpandedKeys-' + props.name,
    [] as (string | number)[],
  );
  const wrapperInnerExpandedKeys = computed(() =>
    innerExpandedKeys.value.length > 0 ? innerExpandedKeys.value : undefined,
  );
  const handleUpdateExpandedKeys = (keys: (string | number)[]) => {
    if (innerExpandedKeys.value.length) {
      innerExpandedKeys.value = keys;
    }
  };
  watchEffect(() => {
    if (props.expandedKeys) {
      innerExpandedKeys.value = [...props.expandedKeys];
    }
  });
  onBeforeUnmount(() => {
    if (!props.name) {
      sessionStorage.setItem('treeExpandedKeys-' + props.name, JSON.stringify([]));
    }
  });
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>dragable
  const travel = getTreeTravel({
    every(node, parent, index) {
      if (!parent) {
        // @ts-expect-error
        node.key = index + '';
      } else {
        // @ts-expect-error
        node.key = parent.key + '-' + index;
      }
    },
  });
  watch(
    () => props.treeData,
    (val) => {
      if (props.draggable && !props.treeData?.[0].key) {
        innerData.value = val;
        travel(innerData.value);
      } else {
        innerData.value = val;
      }
    },
    { immediate: true },
  );
  function onDrop(info: AntTreeNodeDropEvent) {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    // @ts-expect-error
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const data: TreeProps['treeData'] = [...innerData.value];

    // Find dragObject
    let dragObj: TreeDataItem;
    findSelfList(
      data,
      dragKey,
      (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
        arr?.splice(index, 1);
        dragObj = item;
      },
    );
    if (!info.dropToGap) {
      // Drop on the content
      findSelfList(data, dropKey, (item: TreeDataItem) => {
        item.children = item.children || [];
        /// where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        setTimeout(() => {
          emit('drop', info, [...item.children]);
        });
      });
    } else if (
      (info.node.children || []).length > 0 && // Has children
      info.node.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      findSelfList(data, dropKey, (item: TreeDataItem) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        setTimeout(() => {
          emit('drop', info, [...item.children]);
        });
      });
    } else {
      let ar: TreeProps['treeData'] = [];
      let i = 0;
      findSelfList(
        data,
        dropKey,
        (_item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
          ar = arr;
          i = index;
        },
      );
      if (dropPosition === -1) {
        // @ts-expect-error
        ar.splice(i, 0, dragObj);
      } else {
        // @ts-expect-error
        ar.splice(i + 1, 0, dragObj);
      }
      setTimeout(() => {
        // @ts-expect-error
        emit('drop', info, [...ar]);
      });
    }
    innerData.value = data;
  }
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  defineExpose({
    treeRef,
  });
</script>

<style lang="scss">
  @import './index.scss';
</style>
