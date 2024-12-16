import type { CLASSES, DOT_INDICATOR, LINE_INDICATOR } from './vars';
import type { BaseProps } from '../types';
import type { RefExtra } from '@laser-ui/hooks/useRefExtra';

export {};

export interface AnchorRef {
  active: string | null;
  updateAnchor: () => void;
}

export interface AnchorItem {
  href: string;
  title?: React.ReactNode;
  target?: string;
  children?: AnchorItem[];
}

export interface AnchorProps<T extends AnchorItem>
  extends BaseProps<'anchor', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLUListElement>, 'children' | 'onClick'> {
  ref?: React.Ref<AnchorRef>;
  list: T[];
  page?: RefExtra;
  distance?: number | string;
  scrollBehavior?: 'instant' | 'smooth';
  indicator?: React.ReactNode | typeof DOT_INDICATOR | typeof LINE_INDICATOR;
  onClick?: (href: string, origin: T) => void;
}
