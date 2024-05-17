import type {
  InputProps,
  InputNumberProps,
  TextAreaProps,
  AutoCompleteProps,
} from 'ant-design-vue';
import type { StyleProp } from './base';

type InputPropsPro = {} & InputProps & StyleProp;
type InputNumberPropsPro = {} & InputNumberProps & StyleProp;
type TextAreaPropsPro = {} & TextAreaProps & StyleProp;
type AutoCompletePropsPro = {} & AutoCompleteProps & StyleProp;

export type { InputNumberProps, InputPropsPro, TextAreaPropsPro, AutoCompletePropsPro };
