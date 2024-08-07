import { onUnmounted, unref } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { watchDebounced } from '@vueuse/core';
import type { NOOP } from '../types/tool';
import { toArray } from '../tools/tool';

export type EffectOps = {
  effectKeys: string[] | string;
  onEffect?: NOOP;
  immediate?: boolean;
  debounce?: number;
};

export function useEffect(model: Ref | ComputedRef, options: EffectOps) {
  let effectCb: (() => void) | undefined = options.onEffect;
  const { effectKeys, immediate, debounce } = options;
  console.log('useEffect', options, model);
  const stop = watchDebounced(
    toArray<string>(effectKeys).map((key) => () => unref(model)[key]),
    () => {
      console.log('useEffect');
      effectCb?.();
    },
    {
      debounce: debounce ?? 300,
      immediate,
    },
  );
  // 卸载时停止监听
  onUnmounted(() => {
    stop?.();
    effectCb = undefined;
  });
  return {
    onEffect(cb: () => void) {
      effectCb = cb;
    },
    offEffect() {
      effectCb = undefined;
    },
  };
}
