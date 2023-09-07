# 接口

```ts
type Lang = 'en-US' | 'zh-CN';

type Size = 'small' | 'medium' | 'large';

type PopupPlacement =
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

type VerticalSidePlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

type CloneHTMLElement<T extends React.ReactElement = React.ReactElement> = (el: T) => T;

interface BaseProps<CR extends string, C extends { [index: string]: string }> {
  styleOverrides?: { [K in keyof C]?: { remove?: boolean; className?: string; style?: React.CSSProperties } };
  styleProvider?: { [K in CR]: string };
}
```
