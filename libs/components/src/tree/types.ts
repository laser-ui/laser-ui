import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps } from '../types';

export {};

export interface TreeItem<V extends React.Key> {
  label: string;
  value: V;
  loading?: boolean;
  disabled?: boolean;
  children?: TreeItem<V>[];
}

export interface TreeProps<V extends React.Key, T extends TreeItem<V>>
  extends BaseProps<'tree', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  formControl?: FormControlProvider;
  list: T[];
  model?: V | null | V[];
  defaultModel?: V | null | V[];
  expands?: V[];
  defaultExpands?: V[];
  showLine?: boolean;
  multiple?: boolean;
  onlyLeafSelectable?: boolean;
  disabled?: boolean;
  virtual?: { listSize: number; listPadding: number; itemSize?: number };
  customItem?: (item: T) => React.ReactNode;
  onModelChange?: (value: any, origin: any) => void;
  onFirstExpand?: (value: V, origin: T) => void;
  onExpandsChange?: (values: V[], origins: T[]) => void;
  onScrollBottom?: () => void;
}
