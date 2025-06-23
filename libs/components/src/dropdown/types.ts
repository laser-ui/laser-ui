import type { CLASSES } from './vars';
import type { BaseProps, VerticalSidePlacement } from '../types';

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
  ref?: React.Ref<DropdownRef>;
  children: (props: {
    id: string;
    tabIndex: number;
    'aria-haspopup': 'menu';
    'aria-expanded': boolean;
    'aria-controls': string;
    onClick: React.MouseEventHandler<HTMLElement>;
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
    onFocus: React.FocusEventHandler<HTMLElement>;
    onBlur: React.FocusEventHandler<HTMLElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  }) => React.ReactNode;
  list: T[];
  visible?: boolean;
  defaultVisible?: boolean;
  trigger?: 'hover' | 'click';
  placement?: VerticalSidePlacement;
  placementFixed?: boolean;
  arrow?: boolean;
  virtual?: boolean | number;
  escClosable?: boolean;
  zIndex?: number | string;
  popupRender?: (el: React.ReactElement) => React.ReactNode;
  onVisibleChange?: (visible: boolean) => void;
  afterVisibleChange?: (visible: boolean) => void;
  onClick?: (id: ID, origin: T) => void | false;
}
