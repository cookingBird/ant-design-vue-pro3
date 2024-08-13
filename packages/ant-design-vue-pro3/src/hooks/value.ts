/* eslint-disable vue/no-ref-as-operand,indent */
import { isRef, type Ref, reactive } from 'vue';

export type ValueInterceptor = {
  afterChange: (value: unknown) => unknown;
  beforeValue: (value: unknown) => unknown;
};

export function useValue(
  prop?: string | number | (string | number)[],
  fallbackValue: any = undefined,
) {
  const props = Array.isArray(prop)
    ? prop
    : typeof prop === 'string'
    ? prop?.split('.')
    : prop !== undefined
    ? [prop]
    : undefined;
  return {
    valueGetter(model: any): any {
      if (model === undefined || model === null) {
        return console.warn('valueGetter no model');
      }
      if (!props) return console.warn('valueGetter no props');
      let val = model;
      props.forEach((key, index) => {
        if (index < props.length - 1) {
          val =
            val[key] === undefined || val[key] === null
              ? isRef(val)
                ? // @ts-expect-error
                  (val.value[key] = reactive({}))
                : (val[key] = reactive({}))
              : val[key];
        } else {
          val =
            val[key] === undefined || val[key] === null
              ? isRef(val)
                ? // @ts-expect-error
                  (val.value[key] = fallbackValue)
                : (val[key] = fallbackValue)
              : val[key];
        }
      });

      return val;
    },
    valueSetter(model: Ref | ReturnType<typeof reactive>, value: any): void {
      if (!props) {
        return console.warn('valueSetter no props');
      }
      let context = model;
      const length = props.length;
      props.forEach((key, index) => {
        if (index < length - 1) {
          isRef(context)
            ? (context = context.value[key])
            : // @ts-expect-error
              (context = context[key]);
        } else {
          isRef(context)
            ? (context.value[key] = value)
            : // @ts-expect-error
              (context[key] = value);
        }
      });
    },
  };
}
