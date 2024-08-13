import type { GetterSetterInterceptor, ValueInterceptor } from '../../hooks/value';
import type { ButtonGroupPro } from '../ButtonGroupPro';
import type { ButtonPro } from '../ButtonPro';
import type { InputPro } from '../InputPro';
import type { Named, VisibleOps, Proped } from '../../types';
import type { DataFetch } from '../../hooks/fetch';
import type { EffectOps } from '../../hooks/effect';

export type Slot = 'buttonGroup' | 'button' | 'input';

interface SlotPropsMap extends Record<Slot, unknown> {
  buttonGroup: ButtonGroupPro;
  button: ButtonPro;
  input: InputPro;
}

export type SlotProps<N extends Slot> = SlotPropsMap[N];

export type TypeNodeProp<P extends Slot = 'input'> = {
  slotIs: P;
  slotProps?: SlotProps<P>;
  wrapperProps?: Record<string, any>;
} & Partial<Proped> &
  Partial<DataFetch> &
  Partial<ValueInterceptor> &
  Partial<EffectOps>;
