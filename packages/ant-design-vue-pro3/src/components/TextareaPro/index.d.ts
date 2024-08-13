import type { TextAreaProps } from 'ant-design-vue';
import type { ValueInterceptor } from '../../hooks/value';

export type TextAreaPro = TextAreaProps &
  Partial<ValueInterceptor> & {
    model?: Record<string, any>;
    prop?: string | string[];
  };
