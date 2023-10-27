import type { BUTTON_CLASSES, CLASSES } from './vars';
import type { BaseProps } from '../types';
import type { RefExtra } from '@laser-ui/hooks/useRefExtra';

export {};

export interface FabProps extends BaseProps<'fab', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactElement;
  expand?: boolean;
  defaultExpand?: boolean;
  list?: { placement: 'top' | 'right' | 'bottom' | 'left'; actions: React.ReactElement[] }[];
  onExpandChange?: (expand: boolean) => void;
}

export interface FabButtonProps extends BaseProps<'fab-button', typeof BUTTON_CLASSES>, React.ButtonHTMLAttributes<HTMLButtonElement> {
  pattern?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text' | 'link';
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
  shape?: 'circle' | 'round';
}

export interface FabBacktopProps extends FabButtonProps {
  page?: RefExtra;
  distance?: number | string;
  scrollBehavior?: 'instant' | 'smooth';
}
