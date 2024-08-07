<template>
  <div
    class="grid-container"
    :style="{
      gridTemplateRows: `repeat(${rows},1fr)`,
      gridTemplateColumns: `repeat(${cols},1fr)`,
      gap: props.gap,
    }"
  >
    <template
      v-for="item in layoutBuilt.sort((t1, t2) => t1.pos - t2.pos)"
      :key="item.pos"
    >
      <div
        ref="itemsRef"
        class="grid-item"
        :data-static="item.static"
        :data-select="item.select"
        :data-pos="item.pos"
        :style="{
          'grid-column-start': `span ${item.w}`,
          'grid-row-start': `span ${item.h}`,
        }"
        @click="selectItem(item)"
      >
        <slot name="content" :context="item" :data="item.data">
          {{ item.pos }}
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import {
    shallowRef,
    computed,
    defineExpose,
    withDefaults,
    defineProps,
    defineOptions,
    ref,
    watchEffect,
  } from 'vue';
  import { useKeyModifier } from '@vueuse/core';
  defineOptions({
    name: 'GridLayout',
  });
  export type Layout = {
    pos: number;
    w: number;
    h: number;
    static?: boolean;
    select?: boolean;
    position?: DOMRect | null;
    [index: string]: any;
  };

  export type LayoutData = {
    pos: number;
    [index: string]: any;
  };

  const props = withDefaults(
    defineProps<{
      rows?: number;
      cols?: number;
      splitColPosMap?: Record<number, number[]>;
      layout?: (Pick<Layout, 'w' | 'h' | 'static'> & { pos?: number })[];
      layoutData?: { pos: string | number }[];
      disabled?: boolean;
      gap?: number;
    }>(),
    {
      rows: 3,
      cols: 4,
      gap: 0,
      splitColPosMap: () => ({
        0: [0, 3, 5],
        3: [3, 5],
        2: [2, 4, 8],
        4: [4, 8],
      }),
      layout: () => [
        { w: 1, h: 1, static: false, pos: 0 },
        { w: 2, h: 2, static: true, pos: 1 },
        { w: 1, h: 1, static: false, pos: 2 },
        { w: 1, h: 1, static: false, pos: 3 },
        { w: 1, h: 1, static: false, pos: 4 },
        { w: 1, h: 1, static: false, pos: 5 },
        { w: 1, h: 1, static: false, pos: 6 },
        { w: 1, h: 1, static: false, pos: 7 },
        { w: 1, h: 1, static: false, pos: 8 },
      ],
      layoutData: () => [],
      disabled: true,
    },
  );

  const layoutBuilt = ref<Layout[]>([]);
  watchEffect(() => {
    layoutBuilt.value = props.layout
      .map((item, index) => {
        return {
          ...item,
          pos: item.pos ?? index,
          select: false,
          position: null,
        };
      })
      .sort((a, b) => a.pos - b.pos);
  });

  watchEffect(() => {
    const layoutData = props.layoutData;
    const builtLayout = layoutBuilt.value;
    layoutBuilt.value = builtLayout.map((layout) => {
      const data = layoutData?.find((data) => data.pos === layout.pos);
      return {
        ...layout,
        data,
      };
    });
  });

  const selected = computed(() => layoutBuilt.value.filter((item) => item.select));

  const onControl = useKeyModifier('Control');

  function selectItem(item: any) {
    if (onControl.value && !item.static && !props.disabled) {
      item.select = !item.select;
    }
  }

  const itemsRef = shallowRef<HTMLElement[] | null>(null);

  function calcPos() {
    itemsRef.value?.forEach((el) => {
      const dataset = el.dataset;
      if (dataset.static === 'true') return;
      const pos = dataset.pos;
      const item = layoutBuilt.value.find((item) => String(item.pos) === pos);
      if (item) {
        item.position = el.getBoundingClientRect();
      }
    });
  }

  function inRow(items = selected.value) {
    if (items.length <= 1) return false;
    return items.reduce((pre, cur, index, array) => {
      if (index === 0) {
        return pre;
      } else {
        return (
          pre &&
          cur.position!.top === array[index - 1].position!.top &&
          cur.position!.height === array[index - 1].position!.height
        );
      }
    }, true);
  }
  function inCol(items = selected.value) {
    if (items.length <= 1) return false;
    return items.reduce((pre, cur, index, array) => {
      if (index === 0) {
        return pre;
      } else {
        return (
          pre &&
          cur.position!.left === array[index - 1].position!.left &&
          cur.position!.width === array[index - 1].position!.width
        );
      }
    }, true);
  }
  function isNested(rowDirect: boolean, colDirect: boolean) {
    if (rowDirect) {
      return selected.value.reduce((pre, cur, index, array) => {
        if (index === 0) {
          return pre;
        } else {
          return pre && cur.position!.left - array[index - 1].position!.right < 30;
        }
      }, true);
    }
    if (colDirect) {
      return selected.value.reduce((pre, cur, index, array) => {
        if (index === 0) {
          return pre;
        } else {
          return pre && cur.position!.top - array[index - 1].position!.bottom < 30;
        }
      }, true);
    }
  }

  function merge() {
    if (props.disabled) return;
    calcPos();
    const isInRow = inRow();
    const isInCol = inCol();
    const nested = isNested(isInRow, isInCol);
    const _selected = [...selected.value];
    if (_selected.length === 0) return;
    if (isInRow && nested) {
      const firstSelected = _selected[0];
      firstSelected.w = _selected.reduce((pre, cur) => {
        return pre + cur.w;
      }, 0);

      _selected.forEach((v, index) => {
        if (index === 0) return;
        const i = layoutBuilt.value?.findIndex((i) => i === v);
        if (i > -1) {
          layoutBuilt.value?.splice(i, 1);
        }
      });
    }
    if (isInCol && nested) {
      const firstSelected = _selected[0];
      firstSelected.h = _selected.reduce((pre, cur) => {
        return pre + cur.h;
      }, 0);

      _selected.forEach((v, index) => {
        if (index === 0) return;
        const i = layoutBuilt.value?.findIndex((i) => i === v);
        if (i > -1) {
          layoutBuilt.value?.splice(i, 1);
        }
      });
    }
  }

  function split() {
    if (props.disabled) return;
    const _selected = selected.value;
    const canSplit = _selected.length === 1;
    const splitItem = { ..._selected[0] };
    if (canSplit) {
      const isRowSplit = splitItem.w > 1;
      if (isRowSplit) {
        const splitItemIndex = splitItem.pos;
        Array(splitItem.w)
          .fill(0)
          .forEach((_, index) => {
            const rawData = index === 0 ? splitItem : {};
            layoutBuilt.value?.splice(splitItemIndex + index, index === 0 ? 1 : 0, {
              ...rawData,
              h: splitItem.h,
              static: false,
              select: false,
              w: 1,
              pos: splitItem.pos + index,
            });
          });
      }
      const isColSplit = splitItem.h > 1;
      if (isColSplit) {
        const splitItemIndex = splitItem.pos;
        const colLayout: number[] = props.splitColPosMap[splitItemIndex];
        const splitCandidate = colLayout.slice(0, splitItem.h);
        splitCandidate.forEach((i) => {
          const rawData = i === splitItemIndex ? splitItem : {};
          layoutBuilt.value?.splice(i, i === splitItemIndex ? 1 : 0, {
            ...rawData,
            w: splitItem.w,
            static: false,
            select: false,
            h: 1,
            pos: i,
          });
        });
      }
    }
    layoutBuilt.value?.forEach((item) => {
      item.select = false;
    });
  }

  defineExpose({
    merge,
    split,
    getLayoutWithData() {
      return layoutBuilt.value.slice();
    },
  });
</script>

<style>
  .grid-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    /* gap: 8px; */
    grid-auto-flow: row dense;
  }

  .grid-item[data-select='true'] {
    outline-color: red;
    outline-style: solid;
    outline-width: 2px;
    outline-offset: -2px;
  }

  .grid-item {
    transition: all 0.3s;
    background-color: #fff;
    overflow: hidden;
    position: relative;
    border-radius: var(--radius, 0px);
  }
</style>
