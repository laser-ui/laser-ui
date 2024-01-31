import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { TreeItem } from '../tree/types';
import type { BaseProps, CloneHTMLElement, Size } from '../types';

export {};

export interface TreeSelectRef {
  updatePosition: () => void;
}

export interface TreeSelectProps<V extends React.Key, T extends TreeItem<V>>
  extends BaseProps<'tree-select' | 'tree' | 'tree-select-popup', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  formControl?: FormControlProvider;
  list: T[];
  model?: V | null | V[];
  defaultModel?: V | null | V[];
  expands?: V[];
  defaultExpands?: V[];
  visible?: boolean;
  defaultVisible?: boolean;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  onlyLeafSelectable?: boolean;
  showLine?: boolean;
  clearable?: boolean;
  loading?: boolean;
  size?: Size;
  disabled?: boolean;
  virtual?: boolean | number;
  escClosable?: boolean;
  customItem?: (item: T) => React.ReactNode;
  customSelected?: (selected: T) => string;
  customSearch?: {
    filter?: (value: string, item: T) => boolean;
    sort?: (a: T, b: T) => number;
  };
  inputRef?: React.ForwardedRef<HTMLInputElement>;
  inputRender?: CloneHTMLElement;
  popupRender?: (el: React.ReactElement) => React.ReactNode;
  onModelChange?: (value: any, origin: any) => void;
  onFirstExpand?: (value: V, origin: T) => void;
  onExpandsChange?: (values: V[], origins: T[]) => void;
  onVisibleChange?: (visible: boolean) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
  onScrollBottom?: () => void;
}
