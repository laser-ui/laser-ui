import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps, Size } from '../types';

export {};

export interface CascaderRef {
  updatePosition: () => void;
}

export interface CascaderItem<V extends React.Key> {
  label: string;
  value: V;
  loading?: boolean;
  disabled?: boolean;
  children?: CascaderItem<V>[];
}

export interface CascaderProps<V extends React.Key, T extends CascaderItem<V>>
  extends BaseProps<'cascader' | 'cascader-popup', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<CascaderRef>;
  formControl?: FormControlProvider;
  list: T[];
  model?: V | null | V[];
  defaultModel?: V | null | V[];
  visible?: boolean;
  defaultVisible?: boolean;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  onlyLeafSelectable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  size?: Size;
  disabled?: boolean;
  virtual?: boolean | number;
  escClosable?: boolean;
  customItem?: (item: T) => React.ReactNode;
  customSelected?: (value: V, selected?: T) => string;
  customSearch?: {
    filter?: (value: string, item: T) => boolean;
    sort?: (a: T, b: T) => number;
  };
  inputProps?: React.ComponentPropsWithRef<'input'>;
  popupRender?: (el: React.ReactElement) => React.ReactNode;
  onModelChange?: (value: any, origin: any) => void;
  onVisibleChange?: (visible: boolean) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onFirstFocus?: (value: V, origin: T) => void;
  afterVisibleChange?: (visible: boolean) => void;
}
