import { type TreeProps } from 'ant-design-vue';
import { type InputPro } from '../InputPro';

export type TreePro = Omit<
  TreeProps,
  | 'onUpdate:selectedKeys'
  | 'onUpdate:checkedKeys'
  | 'onUpdate:expandedKeys'
  | 'onUpdate:searchValue'
> & {
  searchValue?: string;
  searchOptions?: InputPro;
  size?: 'small' | 'medium' | 'large';
  showSearcher?: boolean;
  name?: string;
};
