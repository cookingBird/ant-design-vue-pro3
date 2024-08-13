import type { RadioGroupProps } from 'ant-design-vue';

import type { ValueInterceptor } from '../../hooks/value';

export type RadioGroupPro = RadioGroupProps &
  Partial<ValueInterceptor> & {
    model?: Record<string, any>;
    prop?: string | string[];
  };
