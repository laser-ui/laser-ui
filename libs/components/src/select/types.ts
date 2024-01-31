import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps, CloneHTMLElement, Size } from '../types';

export {};

export interface SelectRef {
  updatePosition: () => void;
}

export interface SelectItem<V extends React.Key> {
  label: string;
  value: V;
  disabled?: boolean;
  children?: SelectItem<V>[];
}

export interface SelectProps<V extends React.Key, T extends SelectItem<V>>
  extends BaseProps<'select' | 'select-popup', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
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
  clearable?: boolean;
  loading?: boolean;
  size?: Size;
  disabled?: boolean;
  monospaced?: boolean;
  virtual?: boolean | number;
  escClosable?: boolean;
  customItem?: (item: T) => React.ReactNode;
  customSelected?: (selected: T) => string;
  customSearch?: {
    filter?: (value: string, item: T) => boolean;
    sort?: (a: T, b: T) => number;
  };
  createItem?: (value: string) => T | undefined;
  inputRef?: React.ForwardedRef<HTMLInputElement>;
  inputRender?: CloneHTMLElement;
  popupRender?: (el: React.ReactElement) => React.ReactNode;
  onModelChange?: (value: any, origin: any) => void;
  onVisibleChange?: (visible: boolean) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onCreateItem?: (item: T) => void;
  onScrollBottom?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
