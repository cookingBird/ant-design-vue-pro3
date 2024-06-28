import type { RadioGroupProps } from 'ant-design-vue';
import type { ButtonPro } from '../ButtonPro';
import { VisibleOps } from '../../types/index';

export type ButtonGroupItem = ButtonPro &
  Partial<VisibleOps> & {
    code?: string;
    label: string;
  };

export type ButtonGroupPro = {
  model?: any;
  prop?: string | string[];
  buttons: ButtonGroupItem[];
  styled?: 'normal' | 'combine';
};
