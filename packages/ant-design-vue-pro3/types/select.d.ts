import type { SelectProps } from 'ant-design-vue';
import type { StyleProp } from './base';

type SelectPropsPro = {
  options: SelectProps['options'] | ((model: any) => SelectProps['options']);
} & SelectProps &
  StyleProp;

export { SelectPropsPro };
