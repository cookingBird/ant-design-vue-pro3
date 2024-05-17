import { useArrayValueGetter } from './value';
import {
  computed,
  watch,
  onUnmounted,
  ref,
  type Ref,
  type ReactiveEffect,
  watchEffect,
  nextTick,
  unref,
} from 'vue';
import { watchDebounced } from '@vueuse/core';
import { type NOOP } from '../types/tool';
import { toArray } from '@/tools/misc';
import { debounce } from '../../../tools/misc/index';

export type EffectOps = {
  effectKeys: string[] | string;
  onEffect?: NOOP;
  immediate?: boolean;
  debounce?: number;
};

export function useEffect(model: ReactiveEffect<any> | Ref<any>, options: EffectOps) {
  const effectCbs = new Set<Function>();
  const { effectKeys } = options;
  // const _reactive = (Array.isArray(effectKeys) ? effectKeys : [effectKeys])
  // 	.map(k => () => getEffectFingerprint(model, k));
  const stop = watchDebounced(
    () => getEffectFingerprint(model, effectKeys),
    () => {
      effectCbs.forEach((cb) => cb());
    },
    {
      debounce: options.debounce || 300,
      immediate: options.immediate,
    },
  );
  // 卸载时停止监听
  onUnmounted(() => {
    stop?.();
    effectCbs.clear();
  });
  return {
    onEffect(cb: Function) {
      effectCbs.add(cb);
      return () => effectCbs.delete(cb);
    },
    offEffect(cb: Function) {
      return effectCbs.delete(cb);
    },
  };
}

function getEffectFingerprint(
  model: Ref<any> | ReactiveEffect<any>,
  effectKey: undefined | string | string[],
): string {
  if (effectKey === void 0) return '';
  if (Array.isArray(effectKey) || typeof effectKey === 'string') {
    const { valueGetter } = useArrayValueGetter(
      Array.isArray(effectKey) ? effectKey : [effectKey],
    );
    return valueGetter(unref(model)).map(JSON.stringify).join(';');
  } else {
    throw Error('effectKey type error');
  }
}
