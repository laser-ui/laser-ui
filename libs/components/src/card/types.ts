import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface CardProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  shadow?: boolean | 'hover';
  header?: React.ReactElement | string;
  actions?: React.ReactNode[];
}

export interface CardHeaderProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

export interface CardContentProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {}

export interface CardActionProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}
