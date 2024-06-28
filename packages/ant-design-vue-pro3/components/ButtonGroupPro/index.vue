<template>
  <div class="button-group-wrapper" :data-style="props.styled">
    <template v-for="btn in buttons" :key="btn.label">
      <button-pro
        v-if="callValue(btn.if, (cb) => cb(model))"
        v-show="callValue(btn.show, (cb) => cb(model))"
        v-bind="omit(btn, 'if', 'show')"
        :model="props.model"
      >
        <template #default>
          <slot :name="btn.code ?? btn.label" :options="btn" :model="model">
            {{ btn.label }}
          </slot>
        </template>
      </button-pro>
    </template>
  </div>
</template>
<script setup lang="ts">
  import { omit } from '../../tools/tool';
  import { callValue } from '../../tools/visible';
  import type { ButtonGroupPro } from '.';
  import ButtonPro from '../ButtonPro/index.vue';
  defineOptions({
    name: 'ButtonGroupPro',
  });
  const props = withDefaults(defineProps<ButtonGroupPro>(), {
    model: null,
    styled: 'normal',
  });
  const buttons = computed(() =>
    props.buttons.map((item, index) => ({
      ...item,
      onClick(done: () => void, model: any) {
        item.onClick?.(done, model);
      },
    })),
  );
</script>

<style>
  @import './index.scss';
</style>
