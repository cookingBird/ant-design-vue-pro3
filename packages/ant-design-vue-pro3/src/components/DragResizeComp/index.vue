<template>
  <DraggableResizeable
    ref="current"
    v-bind="config"
    v-model:x="config.x"
    v-model:y="config.y"
    v-model:w="config.w"
    v-model:h="config.h"
    :active="active"
    class="!border-none"
  >
    <div
      class="box-border flex flex-col h-full gap-4 p-2 bg-white rounded pointer-events-auto"
    >
      <div
        class="flex justify-between pb-2 border-b cursor-move drag-handle"
        @click.stop="active = true"
      >
        <span class="font-bold">
          <slot name="title"></slot>
        </span>
        <span
          class="flex items-center justify-center cursor-pointer"
          @click="$emit('close')"
        >
          <icon-material-symbols:close></icon-material-symbols:close>
        </span>
      </div>
      <div class="flex-grow px-2 overflow-hidden">
        <slot></slot>
      </div>
    </div>
  </DraggableResizeable>
</template>

<script setup lang="ts">
  import DraggableResizeable from 'draggable-resizable-vue3';
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  const props = defineProps({
    w: {
      default: 500,
    },
    h: {
      default: 300,
    },
    x: {
      default: 500,
    },
    y: {
      default: 300,
    },
    draggable: {
      default: true,
    },
    resizable: {
      default: false,
    },
    center: {
      default: [0, 0],
    },
  });
  const current = ref(null);
  const config = ref({
    x: props.x,
    y: props.y,
    w: props.w,
    h: props.h,
    preventDeactivation: true,
    resizable: props.resizable,
    // handles: [],
    handlesType: 'borders',
    handlesBorder: '1px solid #bbb',
    draggable: props.draggable,
    dragHandle: '.drag-handle',
  });
  onMounted(() => {
    if (props.center) {
      const [x = 0, y = 0] = props.center;
      const currentEl = current.value!.$el as HTMLElement;
      const parent = currentEl.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      const { w, h } = config.value;
      config.value.x = (width - w) / 2 + x;
      config.value.y = (height - h) / 2 + y;
    }
  });
  const active = ref(false);

  function onDeActive() {
    active.value = false;
  }
  onMounted(() => {
    document.addEventListener('click', onDeActive);
  });
  onBeforeUnmount(() => {
    document.removeEventListener('click', onDeActive);
  });
</script>

<style lang="scss"></style>
