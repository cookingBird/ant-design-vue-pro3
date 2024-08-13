import { type SelectProps } from 'ant-design-vue';
import type { ValueInterceptor } from '../../hooks/value';
export type SelectOption = {
  label: string;
  value: string;
};
export type SelectPro = Omit<SelectProps, 'options'> &
  Partial<ValueInterceptor> & {
    model?: Record<string, any>;
    prop?: string | string[];
    effectKeys?: string[];
    fetch?: (model: any) => Promise<unknown[]>;
    options?: ((model: any) => SelectOption[]) | SelectOption[];
  };
