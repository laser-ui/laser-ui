import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { TreeItem } from '../tree/types';
import type { BaseProps, Size } from '../types';

export {};

export interface TreeSelectRef {
  updatePosition: () => void;
}

export interface TreeSelectProps<V extends React.Key, T extends TreeItem<V>>
  extends BaseProps<'tree-select' | 'tree' | 'tree-select-popup', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<TreeSelectRef>;
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
  customSelected?: (value: V, selected?: T) => string;
  customSearch?: {
    filter?: (value: string, item: T) => boolean;
    sort?: (a: T, b: T) => number;
  };
  inputProps?: React.ComponentPropsWithRef<'input'>;
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
