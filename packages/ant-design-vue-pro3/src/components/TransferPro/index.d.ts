import type { TransferProps } from 'ant-design-vue';
import type { ValueInterceptor } from '../../hooks/value';
export type SelectOption = {
  label: string;
  value: string;
};
export type TransferPropsPro = Omit<TransferProps, 'onUpdate:targetKeys'> &
  Partial<ValueInterceptor> & {
    'model'?: Record<string, any>;
    'prop'?: string | string[];
    'effectKeys'?: string[];
    'fetch'?: (model: any) => Promise<unknown[]>;
    'onUpdate:targetKeys'?: (val: any) => void;
    'sortable'?: {
      left?: boolean;
      right?: boolean;
    };
  };
