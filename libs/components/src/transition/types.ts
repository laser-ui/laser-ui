export {};

export interface TransitionProps {
  children: (ref: React.RefObject<HTMLElement | null>) => React.ReactElement | null;
  enter: boolean;
  name?: string;
  duration?: number | { enter: number; leave: number };
  skipFirstTransition?: boolean | { enter: boolean; leave: boolean };
  destroyWhenLeaved?: boolean;
  onBeforeEnter?: () => void;
  onEnter?: () => void;
  onAfterEnter?: () => void;
  onBeforeLeave?: () => void;
  onLeave?: () => void;
  onAfterLeave?: () => void;
}
