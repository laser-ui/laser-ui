export {};

export type TransitionState = 'enter' | 'entering' | 'entered' | 'leave' | 'leaving' | 'leaved';

export interface TransitionProps {
  children: (state: TransitionState) => JSX.Element | null;
  enter: boolean | ((prev: boolean) => boolean);
  defaultEnter?: boolean;
  during: number | { enter: number; leave: number };
  mountBeforeFirstEnter?: boolean;
  skipFirstTransition?: boolean | [boolean, boolean];
  destroyWhenLeaved?: boolean;
  afterRender?: () => void;
  afterEnter?: () => void;
  afterLeave?: () => void;
}

export interface CollapseTransitionProps extends Omit<TransitionProps, 'children'> {
  children: (ref: React.RefObject<any>, style: React.CSSProperties, state: TransitionState) => JSX.Element | null;
  originalSize: {
    width?: string | number;
    height?: string | number;
    padding?: [string | number, string | number, string | number, string | number];
  };
  collapsedSize: {
    width?: string | number;
    height?: string | number;
    padding?: [string | number, string | number, string | number, string | number];
    margin?: [string | number, string | number, string | number, string | number];
  };
  styles: Partial<Record<TransitionState, React.CSSProperties>>;
}
