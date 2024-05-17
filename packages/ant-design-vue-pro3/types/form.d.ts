import type { FormProps, FormItemProps } from 'ant-design-vue';
import type { StyleProp } from './base';

type FormPropsPro = {} & FormProps & StyleProp;
type FormItemPropsPro = {} & FormItemProps & StyleProp;

export type { FormPropsPro, FormItemPropsPro };
