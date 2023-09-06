import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface BreadcrumbItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  link?: boolean;
  separator?: React.ReactNode;
}

export interface BreadcrumbProps<ID extends React.Key, T extends BreadcrumbItem<ID>>
  extends BaseProps<'breadcrumb', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onClick'> {
  list: T[];
  separator?: React.ReactNode;
  onClick?: (id: ID, origin: T) => void;
}
