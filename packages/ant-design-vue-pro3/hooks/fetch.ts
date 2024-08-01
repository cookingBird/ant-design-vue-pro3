import { ref, type Ref, type ComputedRef, unref } from 'vue';
import { useEffect } from './effect';

export type DataFetch = {
  fetch: (model: any) => Promise<unknown>;
};

export function useFetch(
  fetch: (model?: {}) => Promise<unknown>,
  model?: Ref | ComputedRef,
  effectKeys?: string[],
) {
  const result = ref<any[]>([]);
  const loading = ref(false);
  const fetchData = () => getData(unref(model));
  if (effectKeys?.length && model) {
    useEffect(model, {
      effectKeys,
      immediate: true,
      debounce: 300,
      onEffect: () => {
        fetchData();
      },
    });
  } else {
    fetchData();
  }

  return {
    result,
    loading,
  };
  async function getData(model: any) {
    try {
      loading.value = true;
      // @ts-expect-error
      result.value = await fetch(model);
    } finally {
      loading.value = false;
    }
  }
}

export function buildParams(
  model: Record<string, any>,
  params?: Record<string, string>,
): Record<string, any> {
  return Object.keys(params || {}).reduce((acc, key) => {
    return {
      ...acc,
      [key]: model[key],
    };
  }, {});
}

export function buildUrl(url: string | undefined, model: Record<string, any>) {
  if (url === undefined) return undefined;
  const regexps = [/{(.*?)}/g, /\[(.*?)\]/g];
  const m = unref(model);
  return regexps.reduce((acc, regexp) => {
    // @ts-expect-error
    return acc.replaceAll(regexp, (_, p) => {
      return m[p];
    });
  }, url);
}
