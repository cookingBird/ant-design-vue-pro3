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
      v-bind="treePropsOmitted"
      v-model:expandedKeys="innerExpandedKeys"
      :treeData="innerData"
      :onDrop="onDrop"
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
  import { ref, computed, watch, watchEffect, useAttrs, onBeforeUnmount } from 'vue';
  import InputPro from '../InputPro/index.vue';
  import { Tree as AntTree } from 'ant-design-vue';
  import { omit, pick } from '../../tools/tool';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import getTreeTravel from '../../tools/getTreeTravel';
  import findSelfList from '../../tools/findSelfList';
  import { treeProps } from 'ant-design-vue/es/tree/Tree.js';
  import type {
    AntTreeNodeDropEvent,
    TreeProps,
    TreeDataItem,
  } from 'ant-design-vue/lib/tree';
  import { useSessionStorage } from '@vueuse/core';
  import { useInnerProps } from '@easy/common-hooks';

  defineOptions({
    name: 'TreePro',
    inheritAttrs: true,
  });

  const treeRef = ref<typeof AntTree | null>(null);
  const attrs = useAttrs();
  const props = defineProps({
    ...treeProps(),
    searchValue: String,
    searchOptions: Object,
    size: {
      type: String,
      default: 'small',
    },
    showSearcher: {
      type: Boolean,
      default: false,
    },
    name: String,
    draggable: {
      type: Boolean,
      default: false,
    },
    blockNode: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits<{
    'update:searchValue': [val: string];
    'click': [ev: MouseEvent, data: any];
    'rightClick': [ev: MouseEvent, data: any];
    'drop': [info: AntTreeNodeDropEvent, changeList: unknown[]];
  }>();

  const treePropsOmitted = computed(() =>
    omit({ ...attrs, ...props }, 'searchValue', 'searchOptions', 'size', 'onDrop'),
  );

  const inputProps = computed(() => pick(props, 'searchOptions', 'searchValue'));

  const modelValueHandler = (val: string) => {
    emit('update:searchValue', val);
  };

  const innerData = ref([] as any);

  // ========================== expand persistence ====================
  const innerExpandedKeys = useSessionStorage(
    'treeExpandedKeys-' + props.name,
    [] as (string | number)[],
  );

  onBeforeUnmount(() => {
    if (!props.name) {
      innerExpandedKeys.value = [];
    }
  });
  // =========================== End ===================================

  // =========================== dragable ==============================
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
      if (val?.length) {
        if (props.draggable && !props.treeData![0]!.key) {
          innerData.value = val;
          travel(innerData.value);
        } else {
          innerData.value = val;
        }
      }
    },
    { immediate: true },
  );
  function onDrop(info: AntTreeNodeDropEvent) {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;

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
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
      setTimeout(() => {
        emit('drop', info, [...ar]);
      });
    }
    innerData.value = data;
  }
  // ===================================================================
  defineExpose({
    treeRef,
  });
</script>

<style lang="scss">
  @import './index.scss';
</style>
