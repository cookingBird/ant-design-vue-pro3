export type VisibleOps = {
  if: boolean | ((...rags: unknown[]) => boolean);
  show: boolean | ((...rags: unknown[]) => boolean);
};

export type EditableOps = {
  readonly: boolean | ((...rags: unknown[]) => boolean);
  disabled: boolean | ((...rags: unknown[]) => boolean);
};

export interface Valued {
  value?: any;
}

export type Proped = {
  prop: string; // ant-design-vue 4 prop = name
  name: string; // 属性名
};

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
