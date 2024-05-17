export function callValue(
  i: boolean | Function | undefined,
  cb: Function,
  fallback: boolean = true,
) {
  if (i === void 0) {
    return fallback;
  } else if (typeof i === 'function') {
    cb(i);
  } else {
    return i;
  }
}
