import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface MenuRef {
  updatePosition: () => void;
}

export type MenuMode = 'horizontal' | 'vertical' | 'popup' | 'icon';

export interface MenuItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  type: 'item' | 'group' | 'sub';
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: MenuItem<ID>[];
}

export interface MenuProps<ID extends React.Key, T extends MenuItem<ID>>
  extends BaseProps<'menu' | 'menu-popup', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  list: T[];
  mode?: MenuMode;
  width?: string | number;
  active?: ID | null;
  defaultActive?: ID;
  expands?: ID[];
  defaultExpands?: ID[];
  expandOne?: boolean;
  expandTrigger?: 'hover' | 'click';
  escClosable?: boolean;
  onActiveChange?: (id: ID, origin: T) => void;
  onExpandsChange?: (ids: ID[], origins: T[]) => void;
}
