import type { CheckboxProps, CheckboxGroupProps } from 'ant-design-vue';
import type { StyleProp } from './base';

type CheckboxPropsPro = {} & CheckboxProps & StyleProp;
type CheckboxGroupPropsPro = {} & CheckboxGroupProps & StyleProp;

export { CheckboxPropsPro, CheckboxGroupPropsPro };
