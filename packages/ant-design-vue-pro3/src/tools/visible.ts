import type { NOOP } from '../types/tool';
export function callValue(i: unknown, cb: NOOP, fallback: boolean = true) {
  if (i === undefined) {
    return fallback;
  } else if (typeof i === 'function') {
    return cb(i);
  } else {
    return i;
  }
}
