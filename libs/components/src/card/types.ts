import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface CardProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  shadow?: boolean | 'hover';
}

export interface CardHeaderProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

export interface CardContentProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {}

export interface CardActionsProps extends BaseProps<'card', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  actions: React.ReactNode[];
}

export interface CardActionProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}
