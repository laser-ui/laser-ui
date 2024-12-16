export {};

export interface PortalProps<T extends Element = HTMLElement> {
  ref?: React.Ref<T | null>;
  children: React.ReactNode;
  selector: (() => T | null) | string;
}
