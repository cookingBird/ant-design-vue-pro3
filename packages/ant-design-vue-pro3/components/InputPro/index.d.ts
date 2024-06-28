import { type InputProps, Input } from 'ant-design-vue';
import type { ValueInterceptor } from '../../hooks/value';

export type InputPro = InputProps &
  Partial<ValueInterceptor> & {
    model?: Record<string, any>;
    prop?: string | string[];
    addonBeforeClick?: () => void;
    addonAfterClick?: () => void;
  };
