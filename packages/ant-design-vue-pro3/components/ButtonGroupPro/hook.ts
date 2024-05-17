import type { MyButton } from '.';
import { reactive, unref } from 'vue';

export type LoadingInstance = {
  value: boolean;
  loading: () => void;
  done: () => void;
};

export function useLoading<T extends MyButton>(buttons: T[]) {
  const buttonsLoading = reactive<Record<string, LoadingInstance>>({});
  buttons
    .map(unref)
    .filter((b) => b.code)
    .forEach((button) => {
      buttonsLoading[button.code] ??
        (buttonsLoading[button.code] = {} as LoadingInstance);

      buttonsLoading[button.code].value = false;
      buttonsLoading[button.code].loading = () =>
        (buttonsLoading[button.code].value = true);
      buttonsLoading[button.code].done = () =>
        (buttonsLoading[button.code].value = false);
    });
  return buttonsLoading;
}
