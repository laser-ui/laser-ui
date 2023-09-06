import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface AccordionItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  region: React.ReactNode;
  arrow?: boolean | 'left';
  disabled?: boolean;
}

export interface AccordionProps<ID extends React.Key, T extends AccordionItem<ID>>
  extends BaseProps<'accordion', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: T[];
  active?: ID | null | ID[];
  defaultActive?: ID | null | ID[];
  activeOne?: boolean;
  arrow?: 'left' | 'right' | false;
  onActiveChange?: (id: any, origin: any) => void;
  afterActiveChange?: (id: ID, origin: T, active: boolean) => void;
}
