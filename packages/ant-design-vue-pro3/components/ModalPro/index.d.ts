import { type ModalProps } from 'ant-design-vue';
import { NOOP } from '../../types/tool';

export type ModalPro = Omit<ModalProps, 'onUpdate:visible' | 'onOk'> & {
  'onUpdate:visible'?: (val: boolean) => void;
  'onOk'?: (done: NOOP) => void;
  'styled'?: 'default' | 'transparent';
};
