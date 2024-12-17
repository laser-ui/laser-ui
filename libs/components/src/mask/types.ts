export {};

export interface MaskProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  visible: boolean;
  onClose?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
