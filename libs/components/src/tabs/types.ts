import type { CLASSES } from './vars';
import type { BaseProps, Size } from '../types';

export {};

export interface TabsRef {
  updateIndicator: () => void;
}

export interface TabsItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  panel: React.ReactNode;
  dropdownRender?: React.ReactNode;
  closable?: boolean;
  disabled?: boolean;
}

export interface TabsProps<ID extends React.Key, T extends TabsItem<ID>>
  extends BaseProps<'tabs', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: T[];
  active?: ID;
  defaultActive?: ID;
  pattern?: 'wrap' | 'slider';
  placement?: 'top' | 'right' | 'bottom' | 'left';
  center?: boolean;
  size?: Size;
  addible?: boolean;
  onActiveChange?: (id: ID, origin: T) => void;
  onAddClick?: () => void;
  onClose?: (id: ID, origin: T) => void;
}
