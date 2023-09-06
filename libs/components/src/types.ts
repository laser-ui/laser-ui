export {};

export type Lang = 'en-US' | 'zh-CN';

export type Size = 'small' | 'medium' | 'large';

export type PopupPlacement =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'right'
  | 'right-top'
  | 'right-bottom'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-top'
  | 'left-bottom';

export type VerticalSidePlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

export type CloneHTMLElement<T extends React.ReactElement = React.ReactElement> = (el: T) => T;

export interface BaseProps<CR extends string, C extends { [index: string]: string }> {
  styleOverrides?: { [K in keyof C]?: { remove?: boolean; className?: string; style?: React.CSSProperties } };
  styleProvider?: { [K in CR]: string };
}
