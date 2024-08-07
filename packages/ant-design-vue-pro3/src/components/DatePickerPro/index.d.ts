import type { DatePickerProps, TimePicker } from 'ant-design-vue';

import type { ValueInterceptor } from '../../hooks/value';

// DatePickerProps [@vue/compiler-sfc error];
// export type DatePickerPro = DatePickerProps &
//   Partial<ValueInterceptor> & {
//     model?: any;
//     prop?: string | number;
//   };
export type DatePickerPro = {
  format?: string;
  valueFormat?: string;
} & Partial<ValueInterceptor> & {
    model?: any;
    prop?: string | number;
  };
