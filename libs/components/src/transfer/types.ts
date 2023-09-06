import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps } from '../types';

export {};

export interface TransferItem<V extends React.Key> {
  label: string;
  value: V;
  disabled?: boolean;
}

export interface TransferProps<V extends React.Key, T extends TransferItem<V>>
  extends BaseProps<'transfer', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  formControl?: FormControlProvider;
  list: T[];
  model?: V[];
  defaultModel?: V[];
  selected?: V[];
  defaultSelected?: V[];
  searchable?: boolean;
  searchValue?: [string, string];
  defaultSearchValue?: [string, string];
  title?: [React.ReactNode?, React.ReactNode?];
  loading?: [boolean?, boolean?];
  disabled?: boolean;
  virtual?: boolean | number;
  customItem?: (item: T) => React.ReactNode;
  customSearch?: {
    filter?: (value: string, item: T) => boolean;
    sort?: (a: T, b: T) => number;
  };
  onModelChange?: (value: V[], item: T[]) => void;
  onSelectedChange?: (value: V[], item: T[]) => void;
  onSearch?: (value: [string, string]) => void;
  onScrollBottom?: (direction: 'left' | 'right') => void;
}
