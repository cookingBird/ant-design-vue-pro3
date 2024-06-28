import { unref } from 'vue';
export * from './validator';

export function omit<T, K extends keyof T>(tar: T, ...keys: K[][] | K[]): Omit<T, K> {
  const obj = {};
  const keysFlat = keys.flat() as (keyof T)[];
  for (const key in tar) {
    if (!keysFlat.includes(key)) {
      // @ts-expect-error
      obj[key] = tar[key];
    }
  }
  return obj as Omit<T, K>;
}

export function pick<T, K extends keyof T>(tar: T, ...keys: K[][] | K[]): Pick<T, K> {
  const obj = {};
  const keysFlat = keys.flat() as (keyof T)[];
  for (const key in tar) {
    if (keysFlat.includes(key)) {
      // @ts-expect-error
      obj[key] = tar[key];
    }
  }
  return obj as Pick<T, K>;
}

export function callFunction(val: unknown, ...args: unknown[]) {
  if (typeof val === 'function') {
    return val(...args.map((arg) => unref(arg)));
  } else {
    return val;
  }
}

export function toArray<T>(val: T | T[]) {
  return Array.isArray(val) ? val : [val];
}
