import { createApp, type Component } from 'vue';
import type { NOOP } from '../types/tool';

export function compile2Body<T extends Record<string, unknown>>(
  component: Component<T & { _close: NOOP }>,
  props: T,
  container = document.body,
) {
  const el: HTMLElement = document.createElement('div');
  el.setAttribute(
    'style',
    `
      display:content;
      position:absolute;
      inset:0;
      background-color:transparent;
      pointer-events: none;
    `,
  );
  container.appendChild(el);
  const remove = () => {
    el.remove();
  };
  const instance = createApp(component, { ...props, _close: remove }).mount(el);
  return instance;
}

export function compile2El<T extends Record<string, unknown>>(
  container: string | HTMLElement,
  component: Component<T & { _close: NOOP }>,
  props: T,
) {
  return compile2Body(
    component,
    props,
    typeof container === 'string' ? document.getElementById(container) : container,
  );
}
