import type { TreeSelectProps } from 'ant-design-vue';
import type { ValueInterceptor } from '../../hooks/value';
export type SelectOption = {
  label: string;
  value: string;
  children?: SelectOption[];
};
export type TreeSelectPropsPro = Omit<TreeSelectProps, 'options'> &
  Partial<ValueInterceptor> & {
    model?: Record<string, any>;
    prop?: string | string[];
    effectKeys?: string[];
    fetch?: (model: any) => Promise<unknown[]>;
    options?: ((model: any) => SelectOption[]) | SelectOption[];
  };
