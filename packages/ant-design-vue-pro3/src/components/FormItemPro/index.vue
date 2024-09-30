<template>
  <AntFormItem v-bind="omit(props, 'tooltip')" class="form-item-pro">
    <template #label>
      {{ props.label }}
      <Tooltip v-if="props.tooltip" v-bind="props.tooltip">
        <template #title>
          {{ props.tooltip.content }}
        </template>
        <span class="form-item-tooltip-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              :stroke="props.tooltip.color || '#1890ff'"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="9" stroke-linecap="round" stroke-width="2" />
              <path stroke-width="3" d="M12 16h.01v.01H12z" />
              <path
                stroke-linecap="round"
                stroke-width="2"
                d="M10.586 7.586c.39-.39.9-.585 1.41-.586a2 2 0 0 1 1.418.586c.39.39.586.902.586 1.414s-.195 1.024-.586 1.414a2 2 0 0 1-1.418.586L12 12"
              />
            </g>
          </svg>
        </span>
      </Tooltip>
    </template>
    <slot></slot>
  </AntFormItem>
</template>

<script setup lang="ts">
  import { PropType } from 'vue';
  import { FormItem as AntFormItem, Tooltip } from 'ant-design-vue';
  import { formItemProps } from 'ant-design-vue/es/form/FormItem';
  import { tooltipProps } from 'ant-design-vue/es/tooltip/index';
  import { omit } from 'lodash';
  const props = defineProps({
    ...formItemProps(),
    tooltip: Object as PropType<
      ReturnType<typeof tooltipProps> & { content: string; color: string }
    >,
  });
</script>

<style lng="scss">
  @import './index.scss';
  .form-item-tooltip-wrapper {
    padding-left: 2px;
    display: flex;
    align-items: center;
    cursor: help;
  }
</style>
