import type { CLASSES } from './vars';
import type { BaseProps, CloneHTMLElement, VerticalSidePlacement } from '../types';

export {};

export interface DropdownRef {
  updatePosition: () => void;
}

export interface DropdownItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  type: 'item' | 'group' | 'sub';
  icon?: React.ReactNode;
  disabled?: boolean;
  separator?: boolean;
  children?: DropdownItem<ID>[];
}

export interface DropdownProps<ID extends React.Key, T extends DropdownItem<ID>>
  extends BaseProps<'dropdown' | 'dropdown-popup', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
  children: React.ReactElement | ((render: CloneHTMLElement) => React.ReactNode);
  list: T[];
  visible?: boolean;
  defaultVisible?: boolean;
  trigger?: 'hover' | 'click';
  placement?: VerticalSidePlacement;
  placementFixed?: boolean;
  arrow?: boolean;
  escClosable?: boolean;
  zIndex?: number | string;
  popupRender?: (el: React.ReactElement) => React.ReactNode;
  onVisibleChange?: (visible: boolean) => void;
  afterVisibleChange?: (visible: boolean) => void;
  onClick?: (id: ID, origin: T) => void | false;
}
