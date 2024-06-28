import type { TransferProps } from 'ant-design-vue';
import type { ValueInterceptor } from '../../hooks/value';
export type SelectOption = {
  label: string;
  value: string;
};
export type TransferPropsPro = TransferProps &
  Partial<ValueInterceptor> & {
    model?: Record<string, any>;
    prop?: string | string[];
    effectKeys?: string[];
    fetch?: (model: any) => Promise<unknown[]>;
    keyField?: string;
  };
