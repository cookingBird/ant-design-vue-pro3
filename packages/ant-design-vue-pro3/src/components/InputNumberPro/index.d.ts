import { type InputNumberProps } from 'ant-design-vue';
import type { ValueInterceptor } from '../../hooks/value';

export type InputNumberPro = InputNumberProps &
  Partial<ValueInterceptor> & {
    model?: Record<string, any>;
    prop?: string | string[];
    addonBeforeClick?: () => void;
    addonAfterClick?: () => void;
  };
