import type { FormPropsPro, FormItemPropsPro } from '../../types/form';
import type { VisibleOps, Events, Proped } from '../../types';
import type { DataFetch } from '../../hooks/fetch';

import type { SlotFormItem, Slot, SlotProps } from '../TypeNode';
import type { GetterSetterInterceptor } from '../../hooks/value';

export type FormPropOptions<M> = {
  columns: FromItemProOptions<M>[];
} & FormPropsPro;

export type FromItemProOptions<M> = Partial<VisibleOps> &
  SlotFormItem &
  GetterSetterInterceptor &
  FormItemPropsPro &
  Partial<Proped<M>>;

export type FormItemWithSlotProps<S extends Slot> = {
  slotProps?: SlotProps<S>;
} & Partial<VisibleOps> &
  SlotFormItem &
  FormItemPropsPro &
  Events;
