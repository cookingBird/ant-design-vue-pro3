import { request, type RequestMethodType } from '../tools/Ajax';
import { ref, type Ref, type ReactiveEffect, unref } from 'vue';
import type { GenericFunction, Result } from '../types';
import { type EffectOps, useEffect } from './effect';

export interface DataFetch {
  url: string;
  method: string;
  params: Record<string, string>;
  data: Record<string, string>;
  fetch: (...args: unknown[]) => Promise<Result<unknown>>;
  fetchCallback: (...args: unknown[]) => unknown;
}
export type FetchResult = {
  result: Ref<unknown>;
  run: (p: Record<string, any>, done: GenericFunction) => void;
};

export function useFetch(
  model: Ref<any> | ReactiveEffect<any>,
  options: Partial<DataFetch & EffectOps>,
  callbacks?: Record<'startCb' | 'successCb' | 'errorCb' | 'finallyCb', GenericFunction>,
): FetchResult {
  const { url, method, fetch, params, effectKeys } = options;
  const { startCb, successCb, errorCb, finallyCb } = callbacks || {};
  const result = ref<unknown>(null);

  const fetchData = () =>
    getData(unref(model), unref(buildUrl(url, model)), unref(buildParams(model, params)));

  if (options.effectKeys) {
    const { onEffect } = useEffect(model, options as EffectOps);
    onEffect(fetchData);
    onEffect(() => options?.onEffect?.(model));
  }
  async function getData(
    model: any,
    params: Record<string, any>,
    paras?: Record<string, any>,
    done?: GenericFunction,
  ) {
    try {
      if (unref(url)) {
        const requestOps = {
          url: unref(url) as string,
          method: unref((method || 'get') as RequestMethodType),
          params: Object.assign({}, params, paras),
          data: Object.assign({}, params, paras),
        };
        startCb?.(requestOps);
        const res = await request<any>(requestOps);
        if (res.code === 200) {
          result.value = res.data;
          successCb?.(res.data);
          done?.(res.data);
        } else {
          // 请求失败
          errorCb?.(res);
        }
      } else if (fetch) {
        const res = await fetch(model, Object.assign({}, params, paras));
        if (res.code === 200) {
          console.log('fetch success', res);
          result.value = res.data;
          successCb?.(res.data);
          done?.(res.data);
        }
      }
    } catch (error) {
      console.error('table pro fetch data error', error);
    } finally {
      finallyCb?.(result.value);
    }
  }

  return {
    result,
    run(p: Record<string, any>, done: GenericFunction) {
      getData(unref(model), unref(buildParams(model, params)), p, done);
    },
  };
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
  if (url === void 0) return {};
  const regexps = [/{(.*?)}/g, /\[(.*?)\]/g];
  const m = unref(model);
  return regexps.reduce((acc, regexp) => {
    return acc.replaceAll(regexp, (_, p) => {
      return m[p];
    });
  }, url);
}
