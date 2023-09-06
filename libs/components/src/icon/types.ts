import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface IconProps extends BaseProps<'icon', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.FunctionComponentElement<React.SVGProps<SVGSVGElement>>;
  size?: number | string | [number | string, number | string];
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  rotate?: number;
  spin?: boolean;
  spinSpeed?: number | string;
}
