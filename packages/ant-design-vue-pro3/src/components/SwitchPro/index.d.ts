import type { SwitchProps } from 'ant-design-vue';
import type { ValueInterceptor } from '../../hooks/value';

export type SwitchPro = SwitchProps &
  Partial<ValueInterceptor> & {
    model?: Record<string, any>;
    prop?: string | string[];
    addonBeforeClick?: () => void;
    addonAfterClick?: () => void;
  };
