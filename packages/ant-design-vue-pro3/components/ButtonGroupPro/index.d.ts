import type {
  ButtonProps,
  SpaceProps,
  DropdownProps,
  RadioGroupProps,
  RadioProps,
  RadioButtonProps,
  MenuProps,
  MenuItemProps,
} from 'ant-design-vue';

import type { DropdownButtonProps } from 'ant-design-vue/es/dropdown/dropdown-button';
import type { RadioButtonProp } from 'ant-design-vue/es/radio/RadioButton';

import type { Events, VisibleOps, Named, Valued } from '../../types';

export type MyButtonGroup = SpaceProps & { buttons: MyButton[] };

export type MyButtonOptions = {
  label: string;
  code?: string;
} & (DropdownButtonProps | RadioProps | MenuItemProps) &
  Partial<Events>;

export type MyMenuItem = {} & MenuItemProps & Events & Named;

export type MyMenu = {
  options: MyMenuItem[];
} & MenuProps &
  Events;

export type MyButton = {
  typeIs: 'button' | 'dropdown' | 'radioButtonGroup' | undefined;
  label: string;
  code: string;
  options?: MyButtonOptions[];
  menuProps?: MyMenu;
} & Partial<Events> &
  Partial<VisibleOps> &
  Partial<DropdownProps> &
  RadioGroupProps &
  ButtonProps &
  Valued;
