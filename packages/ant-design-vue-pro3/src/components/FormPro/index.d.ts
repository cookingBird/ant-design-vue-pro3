import type { VisibleOps, Events, Proped } from '../../types';
import type { DataFetch } from '../../hooks/fetch';

import type { TypeNodeProp, Slot, SlotProps } from '../TypeNode/index';

import type { FormProps, FormItemProps, RowProps, ColProps } from 'ant-design-vue';

import type { ValueInterceptor } from '../../hooks/value';

export type FormItemProOptions = Partial<VisibleOps> &
  Partial<ValueInterceptor> &
  TypeNodeProp & {
    formItemProps: FormItemProps;
    col?: ColProps;
    children?: {
      columns: FormItemProOptions[];
      row?: RowProps;
      colon?: FormItemProps['colon'];
      labelCol?: FormItemProps['labelCol'];
      labelAlign?: FormItemProps['labelAlign'];
    };
  };

export type FormProProps = FormProps & {
  options: {
    columns: FormItemProOptions[];
    row?: RowProps;
  } & FormProps;
  model: any;
  styled?: 'transparent' | 'default';
};
