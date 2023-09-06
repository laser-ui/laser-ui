import type { CLASSES, SIMPLE_IMG } from './vars';
import type { BaseProps } from '../types';

export {};

export interface EmptyProps extends BaseProps<'empty', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  image?: React.ReactNode | typeof SIMPLE_IMG;
  description?: React.ReactNode;
}
