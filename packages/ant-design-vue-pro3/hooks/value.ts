import { isRef, type Ref, reactive, ref } from 'vue';

export type GetterSetterInterceptor = {
  beforeGetter?: (value: any, model: any) => any;
  beforeSetter?: (value: any, model: any) => any;
};

export function useValue(
  prop?: string | number | (string | number)[],
  fallbackValue: any = '',
) {
  const props = Array.isArray(prop)
    ? prop
    : typeof prop === 'string'
    ? prop?.split('.')
    : prop !== void 0
    ? [prop]
    : void 0;
  return {
    valueGetter(model: any): any {
      if (model === void 0 || model === null) {
        throw Error('value getter model context is null ro undefined');
      }
      if (!props) {
        return model;
      }
      let val = model;
      props.forEach((key, index) => {
        if (index < props.length - 1) {
          val =
            val[key] === void 0 || val[key] === null
              ? isRef(val)
                ? //@ts-expect-error
                  (val.value[key] = reactive({}))
                : (val[key] = reactive({}))
              : val[key];
        } else {
          val =
            val[key] === void 0 || val[key] === null
              ? isRef(val)
                ? //@ts-expect-error
                  (val.value[key] = fallbackValue)
                : (val[key] = fallbackValue)
              : val[key];
        }
      });

      return val;
    },
    valueSetter(model: Ref | ReturnType<typeof reactive>, value: any): void {
      if (!props) {
        if (isRef(model)) {
          model.value = value;
        } else {
          model = ref(value);
        }
      } else {
        let context = model;
        const length = props.length;
        props.forEach((key, index) => {
          if (index < length - 1) {
            isRef(context)
              ? //@ts-expect-error
                (context = context.value[key])
              : //@ts-expect-error
                (context = context[key]);
          } else {
            isRef(context)
              ? //@ts-expect-error
                (context.value[key] = value)
              : //@ts-expect-error
                (context[key] = value);
          }
        });
      }
    },
  };
}

export function useArrayValueGetter(props: string[], fallbackValue: any = null): any {
  const propsGetter = props.map((p) => useValue(p, fallbackValue).valueGetter);
  return {
    valueGetter(model: any): any {
      return propsGetter.map((valueGetter) => valueGetter(model));
    },
  };
}
