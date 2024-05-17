import type { EditableOps, VisibleOps } from '../../types';
import type { GetterSetterInterceptor } from '../../hooks/value';
import type { MyButtonGroup } from '../ButtonGroupPro';
import type {
  SelectPropsPro,
  InputPropsPro,
  InputNumberPropsPro,
  TextAreaPropsPro,
  CheckboxPropsPro,
  CheckboxGroupPropsPro,
  AutoCompletePropsPro,
  CascaderPropsPro,
  DatePickerPropsPro,
  FormPropsPro,
  FormItemPropsPro,
  MentionsPropsPro,
  RadioPropsPro,
  RadioGroupPropsPro,
  RatePropsPro,
  SliderPropsPro,
  SwitchPropsPro,
  TimePickerPropsPro,
  TransferPropsPro,
  TreeSelectPropsPro,
  UploadPropsPro,
  Named,
  Events,
  EditableOps,
  VisibleOps,
  Proped,
} from '../../types';
import type { DataFetch } from '../../hooks/fetch';
import type { EffectOps } from '../../hooks/effect';

export type Slot =
  | 'textarea'
  | 'buttonGroup'
  | 'autoComplete'
  | 'cascader'
  | 'checkbox'
  | 'checkboxGroup'
  | 'datePicker'
  | 'form'
  | 'formItem'
  | 'input'
  | 'inputNumber'
  | 'InputPassword'
  | 'mentions'
  | 'radioGroup'
  | 'radio'
  | 'radioButton'
  | 'rate'
  | 'select'
  | 'slider'
  | 'switch'
  | 'timePicker'
  | 'transfer'
  | 'treeSelect'
  | 'upload'
  | 'div';

interface SlotPropsMap extends Record<Slot, unknown> {
  textarea: TextAreaPropsPro;
  autoComplete: AutoCompletePropsPro;
  cascader: CascaderPropsPro;
  checkbox: CheckboxPropsPro;
  checkboxGroup: CheckboxGroupPropsPro;
  datePicker: DatePickerPropsPro;
  input: InputPropsPro;
  inputPassword: InputPropsPro;
  inputNumber: InputNumberPropsPro;
  mentions: MentionsPropsPro;
  radio: RadioPropsPro;
  radioButton: RadioGroupPropsPro;
  radioGroup: RadioGroupPropsPro;
  rate: RatePropsPro;
  select: SelectPropsPro;
  slider: SliderPropsPro;
  switch: SwitchPropsPro;
  timePicker: TimePickerPropsPro;
  transfer: TransferPropsPro;
  treeSelect: TreeSelectPropsPro;
  upload: UploadPropsPro;
  //custom component
  buttonGroup: MyButtonGroup;
}

export type SlotProps<N extends Slot> = SlotPropsMap[N];

export type SlotFormItem = {
  slotIs: Slot | ((model: any) => Slot);
  slotProps?: any;
  wrapperProps?: Object;
} & Partial<Proped> &
  Partial<Named> &
  Partial<Events> &
  Partial<DataFetch> &
  Partial<EffectOps>;

export type TypeNodeProp = {
  slotIs: Slot | ((model: any) => Slot);
  slotProps?: any;
  wrapperProps?: Record<string, any>;
} & Partial<Proped> &
  Partial<Events> &
  Partial<DataFetch> &
  Partial<EffectOps> &
  GetterSetterInterceptor & { required?: boolean };
