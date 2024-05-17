import type { TableProps, TableColumnType, TableColumnsType } from 'ant-design-vue';
import type { TreeStructure } from '@/types/tool';

export type TablePropsPro<R extends Record<string, any> = any, Rest = any> = {
  columns: TableColumnsTypePro<R, Rest>;
} & TableProps;

export type TableColumnTypePro<
  T extends Record<string, any> = any,
  CusProp extends Record<string, unknown> = {},
> = {
  dataIndex?: keyof T | 'actions';
} & TableColumnType<T> &
  CusProp;

export type TableColumnsTypePro<T, Rest extends Record<string, any> = {}> = (
  | TableColumnTypePro<T, Rest>
  | ColumnGroupType<
      TableColumnTypePro<T, Rest>,
      Omit<TableColumnTypePro<T, Rest>, 'dataIndex'>
    >
)[];

type ColumnGroupType<T, P> = {
  children: T[];
} & P;
