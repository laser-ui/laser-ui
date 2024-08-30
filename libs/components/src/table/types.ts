import type { CLASSES } from './vars';
import type { BaseProps, CloneHTMLElement, PopupPlacement } from '../types';

export {};

export interface TableContextData {
  fixed: ('left' | 'right')[];
  ellipsis: boolean;
}

export interface TableProps extends BaseProps<'table', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  border?: boolean;
  ellipsis?: boolean;
}

export interface TableThProps extends BaseProps<'table', typeof CLASSES>, React.ThHTMLAttributes<HTMLTableCellElement> {
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  fixed?: {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
  };
  sort?: {
    options?: ('ascend' | 'descend' | null)[];
    active?: 'ascend' | 'descend' | null;
    defaultActive?: 'ascend' | 'descend' | null;
    onChange?: (order: 'ascend' | 'descend' | null) => void;
  };
  action?: React.ReactNode;
  ellipsis?: boolean;
}

export interface TableTdProps extends BaseProps<'table', typeof CLASSES>, React.TdHTMLAttributes<HTMLTableCellElement> {
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  fixed?: {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
  };
  ellipsis?: boolean;
}

export interface TableFilterProps
  extends BaseProps<'table', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
  children: React.ReactElement | ((render: CloneHTMLElement) => React.ReactNode);
  content?: React.ReactNode;
  footer?: React.ReactElement | false;
  visible?: boolean;
  placement?: PopupPlacement;
  placementFixed?: boolean;
  escClosable?: boolean;
  gap?: number;
  inWindow?: number | false;
  searchable?: boolean;
  searchValue?: string;
  modal?: boolean;
  destroyAfterClose?: boolean;
  zIndex?: number | string;
  onVisibleChange?: (visible: boolean) => void;
  onSearch?: (value: string) => void;
  onReset?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}

export interface TableThActionProps extends BaseProps<'table', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  disabled?: boolean;
}

export interface TableEmptyProps extends BaseProps<'table', typeof CLASSES>, React.HTMLAttributes<HTMLTableRowElement> {
  colSpan?: number;
}

export interface TableExpandProps
  extends BaseProps<'table', typeof CLASSES>,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  expand?: boolean;
  onExpandChange?: (expand: boolean) => void;
}
