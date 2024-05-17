export type * from './cascader';
export type * from './checkbox';
export type * from './form';
export type * from './input';
export type * from './mention';
export type * from './picker';
export type * from './radio';
export type * from './rate';
export type * from './select';
export type * from './slider';
export type * from './switch';
export type * from './transfer';
export type * from './treeSelect';
export type * from './upload';

export type VisibleOps = {
  if: boolean | ((...rags: unknown[]) => boolean);
  show: boolean | ((...rags: unknown[]) => boolean);
};

export type EditableOps = {
  readonly: boolean | ((...rags: unknown[]) => boolean);
  disabled: boolean | ((...rags: unknown[]) => boolean);
};

export type Events = {
  on: Record<string, (e: unknown[], done: () => void, ...args: any[]) => void>;
  event: Record<string, string>;
};

export interface Named {
  label: string;
}

export interface Valued {
  value?: any;
}

export interface Proped<
  T extends Record<string | number, unknown> = Record<string | number, any>,
> {
  prop: (keyof T | 'actions') | (keyof T | 'actions')[]; // ant-design-vue 4 prop = name
  name: (keyof T | 'actions') | (keyof T | 'actions')[]; // 属性名
}

export type Result<R> = {
  data: R;
  code: number;
  msg: string;
};
export type PaginationResult = {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
};

export type UnknownFunction = (...args: unknown[]) => unknown;
export type GenericFunction<P = unknown, R = void> = (arg: P) => R;
