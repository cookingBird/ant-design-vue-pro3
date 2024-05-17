export function isFunction(t: any): boolean {
  return t && {}.toString.call(t) === '[object Function]';
}

export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object';
}
