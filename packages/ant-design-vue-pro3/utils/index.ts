import { createApp, type Component } from 'vue';
import type { NOOP } from '../types/tool';

export function compile2Body<T extends Record<string, unknown>>(
  component: Component<T & { _close: NOOP }>,
  props: T,
) {
  const el: HTMLElement = document.createElement('div');
  document.body.appendChild(el);
  const remove = () => {
    el.remove();
  };
  const instance = createApp(component, { ...props, _close: remove }).mount(el);
  return instance;
}
