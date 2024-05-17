import type { DatePickerProps, TimePickerProps } from 'ant-design-vue';
import type { StyleProp } from './base';

type DatePickerPropsPro = {} & DatePickerProps & StyleProp;
type TimePickerPropsPro = {} & TimePickerProps & StyleProp;

export type { DatePickerPropsPro, TimePickerPropsPro };
