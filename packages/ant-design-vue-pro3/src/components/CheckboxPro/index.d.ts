import type { CheckboxProps } from 'ant-design-vue';
import type { ValueInterceptor } from '../../hooks/value';

export type CheckboxPro = CheckboxProps &
  Partial<ValueInterceptor> & {
    model?: Record<string, any>;
    prop?: string | string[];
    addonBeforeClick?: () => void;
    addonAfterClick?: () => void;
  };
