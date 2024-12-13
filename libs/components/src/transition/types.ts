export {};

export interface TransitionProps {
  children: (ref: React.RefCallback<HTMLElement | null>, leaved: boolean) => React.ReactElement | null;
  enter: boolean;
  name?: string;
  duration?: number | { enter: number; leave: number };
  skipFirstTransition?: boolean | { enter: boolean; leave: boolean };
  onBeforeEnter?: (el: HTMLElement | null) => void;
  onEnter?: (el: HTMLElement | null) => void;
  onAfterEnter?: (el: HTMLElement | null) => void;
  onEnterCancelled?: (el: HTMLElement | null) => void;
  onBeforeLeave?: (el: HTMLElement | null) => void;
  onLeave?: (el: HTMLElement | null) => void;
  onAfterLeave?: (el: HTMLElement | null) => void;
  onLeaveCancelled?: (el: HTMLElement | null) => void;
}

export interface CollapseTransitionProps extends TransitionProps {
  width?: number;
  height?: number;
}
