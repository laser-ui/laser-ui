export {};

export interface PortalProps {
  children: React.ReactNode;
  selector: (() => HTMLElement | null) | string;
}
