import { NOOP } from '../../types/tool';
import { type ButtonProps, type PopconfirmProps } from 'ant-design-vue';
import type { VNode } from 'vue';
// omit loading prop and override onClick
export type ButtonPro = Omit<ButtonProps, 'loading' | 'onClick'> & {
  onClick: {
    (done: NOOP): void;
    (done: NOOP, model: any): void;
  };
  model?: any;
  active?: boolean;
  confirm?: PopconfirmProps;
  label?: string;
};
