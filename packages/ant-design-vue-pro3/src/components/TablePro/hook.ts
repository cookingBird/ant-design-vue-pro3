export function useScroll(width: number, height: number) {
  const scroll = ref({
    scrollToFirstRowOnChange: undefined,
    x: undefined,
    y: undefined,
  });
  return scroll;
}
