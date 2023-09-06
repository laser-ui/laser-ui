import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface AvatarProps extends BaseProps<'avatar', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  shape?: 'circle' | 'square';
  img?: React.ImgHTMLAttributes<HTMLImageElement>;
  icon?: React.ReactNode;
  text?: React.ReactNode;
  size?: number | string;
}
