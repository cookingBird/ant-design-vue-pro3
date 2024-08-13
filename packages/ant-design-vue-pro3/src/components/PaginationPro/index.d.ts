import { type PaginationProps } from 'ant-design-vue';

// v-model's event cause compile error
// export type PaginationPro = PaginationProps & {};
export type PaginationPro = Omit<
  PaginationProps,
  'onUpdate:pageSize' | 'onUpdate:current'
> & {};
