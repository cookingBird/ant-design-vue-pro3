import type { Events } from '../types';
import type { LoadingInstance } from '../components/ButtonGroupPro/hook';
import { defineEmits, nextTick } from 'vue';
import type { NOOP } from '../types/tool';
/**
 * @description 构造组件的事件属性
 * on: 传入一个事件回调函数，直接调用；
 * event: 传入一个Record,key为事件名，value为映射的事件名；
 * 	事件会以映射的事件名emit出去，
 * 	同时如果传入了对应事件的 on+'事件' 的方法，则会回调改方法；
 */
export function buildListeners<T extends Partial<Events>>(
  attrs: Record<string, any>,
  options: T,
  emits: ReturnType<typeof defineEmits>,
  buttonLoading: LoadingInstance | null,
  ...args: unknown[]
) {
  const events: Record<string, NOOP> = {};
  const eventsQueue: Record<string, any[]> = {};
  if (options.on) {
    Object.entries(options.on).forEach(([event, cb]) => {
      if (!events[event]) {
        events[event] = (...args: unknown[]) =>
          eventsQueue[event].forEach((fn) => fn(...args));
        eventsQueue[event] = [];
      }
      eventsQueue[event].push((...e: unknown[]) => {
        nextTick(() => {
          buttonLoading?.loading();
          const done = () => buttonLoading?.done();
          cb(e, done, ...args);
        });
      });
    });
  }
  if (options.event) {
    Object.entries(options.event).forEach(([event, emit]) => {
      if (!events[event]) {
        events[event] = (...args: unknown[]) =>
          eventsQueue[event].forEach((fn) => fn(...args));
        eventsQueue[event] = [];
      }
      eventsQueue[event].push((...e: unknown[]) => {
        buttonLoading?.loading();
        const done = () => buttonLoading?.done();
        emits(emit, e, done, ...args);
        const key = Object.keys(attrs).find((k) =>
          String(emit).toLocaleLowerCase().endsWith(k),
        );

        // trigger onEventProps
        if (key !== undefined && typeof attrs[key] === 'function') {
          attrs[key]?.(e, done, ...args);
        }
      });
    });
  }

  return events;
}
