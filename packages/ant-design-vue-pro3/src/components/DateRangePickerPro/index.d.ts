import type { RangePickerProps } from 'ant-design-vue';
import type { ValueInterceptor } from '../../hooks/value';

// DatePickerProps [@vue/compiler-sfc error];
// export type DateRangePickerPro = RangePickerProps &
//   Partial<ValueInterceptor> & {
//     model?: any;
//     prop?: string;
//   };

export type DateRangePickerPro = {
  format?: string;
  valueFormat?: string;
} & Partial<ValueInterceptor> & {
    model?: any;
    prop?: string;
  };
