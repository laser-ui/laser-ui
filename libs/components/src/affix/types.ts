import type { RefExtra } from '@laser-ui/hooks/useRefExtra';

export {};

export interface AffixRef {
  sticky: boolean;
  updatePosition: () => void;
}

export interface AffixProps {
  ref?: React.Ref<AffixRef>;
  children: (props: {
    style?: React.CSSProperties;
    'aria-hidden'?: true;
    'data-l-affix-placeholder'?: string;
    'data-l-affix'?: string;
  }) => React.ReactElement | null;
  top?: number | string;
  target?: RefExtra;
  zIndex?: number | string;
}
