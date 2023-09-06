import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface SlidesAutoplayOptions {
  delay?: number;
  stopOnLast?: boolean;
  pauseOnMouseEnter?: boolean;
}

export interface SlidesPaginationOptions {
  visible?: boolean | 'hover';
  dynamic?: boolean;
}

export interface SlidesItem<ID extends React.Key> {
  id: ID;
  tooltip?: string;
  content: React.ReactNode;
}

export interface SlidesProps<ID extends React.Key, T extends SlidesItem<ID>>
  extends BaseProps<'slides', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: T[];
  active?: ID;
  defaultActive?: ID;
  autoplay?: number | SlidesAutoplayOptions;
  arrow?: boolean | 'hover';
  pagination?: boolean | 'hover' | SlidesPaginationOptions;
  vertical?: boolean;
  effect?: 'slide' | 'fade';
  onActiveChange?: (id: ID, origin: T) => void;
}
