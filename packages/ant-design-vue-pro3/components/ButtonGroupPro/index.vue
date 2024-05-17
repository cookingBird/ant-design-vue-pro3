<template>
  <AntSpace v-bind="omit(options, 'buttons')">
    <template v-for="btn in buttons">
      <AntButton
        v-if="(btn.typeIs === 'button' || btn.typeIs === void 0)
				&& callValue(btn.if, (cb:any) => cb(model))"
        v-show="callValue(btn.show, (cb:any) => cb(model))"
        v-bind="omit(btn, 'on', 'event')"
        v-on="buildListeners($attrs, btn, emits, buttonsLoading[btn.code], model)"
      >
        {{ btn.label }}
      </AntButton>
      <AntDropdownButton
        v-else-if="btn.typeIs === 'dropdown' && callValue(btn.if, (cb:any) => cb(model))"
        v-show="callValue(btn.show, (cb:any) => cb(model))"
        v-model:value="btn.value"
        v-bind="omit(btn, 'on', 'event', 'menuProps')"
        v-on="btn.on"
      >
        {{ btn.label }}
        <template #overlay>
          <AntMenu v-bind="btn.menuProps" v-on="btn.menuProps?.on">
            <AntMenuItem
              v-for="(item, index) in btn.menuProps?.options"
              :key="index"
              v-bind="omit(item, 'on', 'event')"
              v-on="item?.on"
            >
              {{ item.title || item.label }}
            </AntMenuItem>
          </AntMenu>
        </template>
      </AntDropdownButton>
      <AntRadioGroup
        v-else-if="btn.typeIs === 'radioButtonGroup'
				&& callValue(btn.if, (cb:any) => cb(model))"
        v-show="callValue(btn.show, (cb:any) => cb(model))"
        v-model:value="btn.value"
        v-bind="omit(btn, 'on', 'event')"
        v-on="btn.on"
      >
        <template v-for="radio in btn.options">
          <a-radio-button :value="radio.code">
            {{ radio.label }}
          </a-radio-button>
        </template>
      </AntRadioGroup>
    </template>
  </AntSpace>
</template>
<script setup lang="ts">
  import { useLoading } from './hook';
  import { computed } from 'vue';
  import { buildListeners } from '../../tools/event';
  import { omit } from '../../tools/tool';
  import { callValue } from '../../tools/visible';
  import type { MyButtonGroup } from '.';
  import {
    Space as AntSpace,
    Button as AntButton,
    DropdownButton as AntDropdownButton,
    RadioGroup as AntRadioGroup,
    Menu as AntMenu,
    MenuItem as AntMenuItem,
  } from 'ant-design-vue';
  defineOptions({
    name: 'AButtonGroupPro',
  });
  const props = withDefaults(
    defineProps<{
      options: MyButtonGroup;
      model: any;
    }>(),
    {},
  );
  const emits = defineEmits();

  const buttonsLoading = useLoading(
    props.options?.buttons?.filter((b) => b.typeIs === 'button' || b.typeIs === void 0) ||
      [],
  );
  const buttons = computed(() =>
    props.options?.buttons?.map((item) => {
      return {
        ...item,
        loading: buttonsLoading[item.code]?.value,
      };
    }),
  );
</script>

<style scoped>
  @import './index.css';
</style>
